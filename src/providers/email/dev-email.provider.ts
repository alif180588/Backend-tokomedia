import { OtpProvider } from '../otp-provider.interface';
import { logger } from '../../utils/logger';

export class DevEmailProvider implements OtpProvider {
  async sendOtp(identifier: string, otp: string, purpose: 'register' | 'login'): Promise<boolean> {
    logger.info(`[DEV OTP EMAIL] Sending OTP to ${identifier} for ${purpose}`);
    logger.info(`[DEV OTP EMAIL] OTP CODE: ${otp}`);
    return true;
  }
}
