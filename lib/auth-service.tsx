import { sdk } from './sdk';
import { BirrError, AuthError, ValidationError, DuplicateError } from './errors';
import { sendEmail } from './email';
import crypto from 'crypto';

export interface AuthUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: string;
  verified: boolean;
  createdAt: Date;
}

export interface Session {
  token: string;
  user: AuthUser;
  createdAt: Date;
  expiresAt: Date;
}

const SESSION_EXPIRY_HOURS = 24;
const OTP_EXPIRY_MINUTES = 10;

// In-memory session store (would use Redis in production)
const sessions = new Map<string, Session>();
const otpStore = new Map<string, { code: string; email: string; createdAt: Date; reason: string }>();

export class AuthService {
  static async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthUser> {
    try {
      // Validate inputs
      if (!email || !password || !name) {
        throw new ValidationError('Email, password, and name are required');
      }

      if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
      }

      // Check if user exists
      const users = await sdk.get<AuthUser>('users');
      if (users.some(u => u.email === email)) {
        throw new DuplicateError('User with this email already exists');
      }

      // Create user with hashed password
      const hashedPassword = this.hashPassword(password);
      const user = await sdk.insert<AuthUser>('users', {
        email,
        password: hashedPassword,
        name,
        role: 'user',
        verified: false,
        createdAt: new Date(),
      } as any);

      // Send verification email with OTP
      await this.sendVerificationEmail(email);

      console.log(`[AUTH] User registered: ${email}`);
      return {
        id: user.id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error('[AUTH] Registration error:', error);
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<{ otpRequired: boolean; token?: string }> {
    try {
      if (!email || !password) {
        throw new AuthError('Email and password are required');
      }

      const users = await sdk.get<any>('users');
      const user = users.find(u => u.email === email);

      if (!user || !this.verifyPassword(password, user.password)) {
        throw new AuthError('Invalid email or password');
      }

      if (!user.verified) {
        // Send OTP for verification
        await this.sendVerificationEmail(email);
        return { otpRequired: true };
      }

      // Create session
      const token = this.createSessionToken();
      const session: Session = {
        token,
        user: {
          id: user.id,
          uid: user.uid,
          email: user.email,
          name: user.name,
          role: user.role,
          verified: user.verified,
          createdAt: user.createdAt,
        },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000),
      };

      sessions.set(token, session);
      console.log(`[AUTH] User logged in: ${email}`);
      return { otpRequired: false, token };
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      throw error;
    }
  }

  static async verifyEmail(email: string, otp: string): Promise<string> {
    try {
      const otpRecord = otpStore.get(email);

      if (!otpRecord) {
        throw new AuthError('No OTP found for this email');
      }

      if (otpRecord.code !== otp) {
        throw new AuthError('Invalid OTP');
      }

      if (Date.now() - otpRecord.createdAt.getTime() > OTP_EXPIRY_MINUTES * 60 * 1000) {
        otpStore.delete(email);
        throw new AuthError('OTP expired');
      }

      // Update user verification status
      const users = await sdk.get<any>('users');
      const userIndex = users.findIndex(u => u.email === email);

      if (userIndex === -1) {
        throw new BirrError('User not found', 'USER_NOT_FOUND', 404);
      }

      const user = users[userIndex];
      user.verified = true;
      await sdk.update('users', user.id, { verified: true });

      otpStore.delete(email);

      // Create session
      const token = this.createSessionToken();
      const session: Session = {
        token,
        user: {
          id: user.id,
          uid: user.uid,
          email: user.email,
          name: user.name,
          role: user.role,
          verified: true,
          createdAt: user.createdAt,
        },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000),
      };

      sessions.set(token, session);
      console.log(`[AUTH] Email verified: ${email}`);
      return token;
    } catch (error) {
      console.error('[AUTH] Email verification error:', error);
      throw error;
    }
  }

  static async requestPasswordReset(email: string): Promise<void> {
    try {
      const users = await sdk.get<any>('users');
      const user = users.find(u => u.email === email);

      if (!user) {
        // Don't reveal if email exists (security best practice)
        console.log(`[AUTH] Password reset requested for non-existent email: ${email}`);
        return;
      }

      await this.sendPasswordResetEmail(email);
      console.log(`[AUTH] Password reset email sent: ${email}`);
    } catch (error) {
      console.error('[AUTH] Password reset request error:', error);
      throw error;
    }
  }

  static async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    try {
      if (newPassword.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
      }

      const otpRecord = otpStore.get(email);

      if (!otpRecord || otpRecord.reason !== 'reset') {
        throw new AuthError('Invalid or expired reset code');
      }

      if (otpRecord.code !== otp) {
        throw new AuthError('Invalid OTP');
      }

      const users = await sdk.get<any>('users');
      const user = users.find(u => u.email === email);

      if (!user) {
        throw new BirrError('User not found', 'USER_NOT_FOUND', 404);
      }

      const hashedPassword = this.hashPassword(newPassword);
      await sdk.update('users', user.id, { password: hashedPassword });

      otpStore.delete(email);
      console.log(`[AUTH] Password reset: ${email}`);
    } catch (error) {
      console.error('[AUTH] Password reset error:', error);
      throw error;
    }
  }

  static async logout(token: string): Promise<void> {
    sessions.delete(token);
    console.log(`[AUTH] User logged out`);
  }

  static getSession(token: string): Session | null {
    const session = sessions.get(token);

    if (!session) {
      return null;
    }

    // Check expiry
    if (Date.now() > session.expiresAt.getTime()) {
      sessions.delete(token);
      return null;
    }

    return session;
  }

  static getCurrentUser(token: string): AuthUser | null {
    const session = this.getSession(token);
    return session?.user || null;
  }

  static requireAdmin(token: string): void {
    const user = this.getCurrentUser(token);
    if (!user || user.role !== 'admin') {
      throw new AuthError('Admin access required');
    }
  }

  private static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  private static verifyPassword(password: string, hash: string): boolean {
    const [salt, storedHash] = hash.split(':');
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return testHash === storedHash;
  }

  private static createSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private static async sendVerificationEmail(email: string): Promise<void> {
    const otp = this.generateOTP();
    otpStore.set(email, { code: otp, email, createdAt: new Date(), reason: 'verify' });

    await sendEmail({
      to: email,
      subject: 'Verify Your Birr Books Account',
      html: `
        <h2>Welcome to Birr Books!</h2>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p>If you didn't create this account, please ignore this email.</p>
      `,
    });
  }

  private static async sendPasswordResetEmail(email: string): Promise<void> {
    const otp = this.generateOTP();
    otpStore.set(email, { code: otp, email, createdAt: new Date(), reason: 'reset' });

    await sendEmail({
      to: email,
      subject: 'Reset Your Birr Books Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Your reset code is: <strong>${otp}</strong></p>
        <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }
}
