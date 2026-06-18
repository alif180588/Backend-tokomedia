import { OtpProvider } from './otp-provider.interface';
import { env } from '../config/environment';

import { DevEmailProvider } from './email/dev-email.provider';
import { NodemailerProvider } from './email/nodemailer.provider';
import { DevWhatsappProvider } from './whatsapp/dev-whatsapp.provider';
import { FonnteWhatsappProvider } from './whatsapp/fonnte.provider';
import { DevSmsProvider } from './sms/dev-sms.provider';

export class ProviderFactory {
  static getEmailProvider(): OtpProvider {
    if (env.ENABLE_DEV_OTP) {
      return new DevEmailProvider();
    }
    return new NodemailerProvider();
  }

  static getWhatsappProvider(): OtpProvider {
    if (env.ENABLE_DEV_OTP) {
      return new DevWhatsappProvider();
    }
    if (env.WHATSAPP_PROVIDER === 'fonnte') {
      return new FonnteWhatsappProvider();
    }
    // Fallback or dev if not configured
    return new DevWhatsappProvider();
  }

  static getSmsProvider(): OtpProvider {
    if (env.ENABLE_DEV_OTP) {
      return new DevSmsProvider();
    }
    // TODO: Return real Twilio provider
    return new DevSmsProvider();
  }
}
