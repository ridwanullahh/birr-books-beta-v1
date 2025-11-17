import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App-specific password from Gmail
  },
});

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.GMAIL_USER || 'noreply@birrbooks.com',
}: EmailPayload): Promise<boolean> {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      headers: {
        'Reply-To': from,
        'List-Unsubscribe': '<mailto:unsubscribe@birrbooks.com>',
      },
    });
    console.log(`[EMAIL] Sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] Failed to send to ${to}:`, error);
    throw error;
  }
}

export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('[EMAIL] Gmail connection verified');
    return true;
  } catch (error) {
    console.error('[EMAIL] Gmail connection failed:', error);
    throw error;
  }
}
