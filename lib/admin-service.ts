import { sdk } from './sdk';
import { BirrError, ForbiddenError, ValidationError } from './errors';
import { AuthService } from './auth-service';

export class AdminService {
  static async createAdmin(email: string, password: string, name: string): Promise<void> {
    try {
      // Register as admin
      const user = await AuthService.register(email, password, name);
      
      // Update role to admin
      await sdk.update('users', user.id, { role: 'admin', verified: true });
      
      console.log(`[ADMIN] Admin user created: ${email}`);
    } catch (error) {
      console.error('[ADMIN] Create admin error:', error);
      throw error;
    }
  }

  static async assignPermissions(
    token: string,
    userId: string,
    permissions: string[]
  ): Promise<void> {
    try {
      AuthService.requireAdmin(token);
      await sdk.update('users', userId, { permissions });
      console.log(`[ADMIN] Permissions assigned to user ${userId}`);
    } catch (error) {
      console.error('[ADMIN] Assign permissions error:', error);
      throw error;
    }
  }

  static async getAuditLog(token: string): Promise<any> {
    try {
      AuthService.requireAdmin(token);
      const logs = sdk.getAuditLog();
      return logs;
    } catch (error) {
      console.error('[ADMIN] Get audit log error:', error);
      throw error;
    }
  }

  static async getUserActivity(token: string, userId: string): Promise<any> {
    try {
      AuthService.requireAdmin(token);
      const logs = sdk.getAuditLog();
      return Object.values(logs).flat().filter((entry: any) => entry.data?.userId === userId);
    } catch (error) {
      console.error('[ADMIN] Get user activity error:', error);
      throw error;
    }
  }
}
