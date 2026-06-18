import { OtpProvider } from '../otp-provider.interface';
import { logger } from '../../utils/logger';

export class DevSmsProvider implements OtpProvider {
  async sendOtp(identifier: string, otp: string, purpose: 'register' | 'login'): Promise<boolean> {
    logger.info(`[DEV OTP SMS] Sending OTP to ${identifier} for ${purpose}`);
    logger.info(`[DEV OTP SMS] OTP CODE: ${otp}`);
    return true;
  }
}
