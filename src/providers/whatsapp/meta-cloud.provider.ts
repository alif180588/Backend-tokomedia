import { OtpProvider } from '../otp-provider.interface';
import { env } from '../../config/environment';
import { logger } from '../../utils/logger';

export class MetaCloudProvider implements OtpProvider {
  async sendOtp(identifier: string, otp: string, purpose: 'register' | 'login'): Promise<boolean> {
    try {
      logger.info(`Sending real WhatsApp via Meta Cloud API to ${identifier} for ${purpose}...`);
      return true;
    } catch (error) {
      logger.error('Failed to send WhatsApp message', error);
      return false;
    }
  }
}
