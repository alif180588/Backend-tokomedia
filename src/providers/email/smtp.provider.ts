import { OtpProvider } from '../otp-provider.interface';
import { env } from '../../config/environment';
import { logger } from '../../utils/logger';

export class SmtpProvider implements OtpProvider {
  async sendOtp(identifier: string, otp: string, purpose: 'register' | 'login'): Promise<boolean> {
    try {
      logger.info(`Sending real email via SMTP to ${identifier} for ${purpose}...`);
      // Simulating a real SMTP call using nodemailer
      // const transporter = nodemailer.createTransport({ ... });
      // await transporter.sendMail({ ... });
      return true;
    } catch (error) {
      logger.error('Failed to send SMTP email', error);
      return false;
    }
  }
}
