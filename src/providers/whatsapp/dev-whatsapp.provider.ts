import { OtpProvider } from '../otp-provider.interface';
import { logger } from '../../utils/logger';

export class DevWhatsappProvider implements OtpProvider {
  async sendOtp(identifier: string, otp: string, purpose: 'register' | 'login'): Promise<boolean> {
    logger.info(`[DEV OTP WHATSAPP] Sending OTP to ${identifier} for ${purpose}`);
    logger.info(`[DEV OTP WHATSAPP] OTP CODE: ${otp}`);
    return true;
  }
}
