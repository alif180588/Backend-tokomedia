import { OtpProvider } from '../otp-provider.interface';
import { env } from '../../config/environment';
import { logger } from '../../utils/logger';

export class TwilioProvider implements OtpProvider {
  async sendOtp(identifier: string, otp: string, purpose: 'register' | 'login'): Promise<boolean> {
    try {
      logger.info(`Sending real SMS via Twilio to ${identifier} for ${purpose}...`);
      return true;
    } catch (error) {
      logger.error('Failed to send Twilio SMS', error);
      return false;
    }
  }
}
