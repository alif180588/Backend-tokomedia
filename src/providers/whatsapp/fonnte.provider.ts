import { OtpProvider } from '../otp-provider.interface';
import { env } from '../../config/environment';
import { logger } from '../../utils/logger';

export class FonnteWhatsappProvider implements OtpProvider {
  async sendOtp(identifier: string, otp: string, purpose: 'register' | 'login'): Promise<boolean> {
    try {
      // Fonnte tidak membutuhkan tanda '+' di depan nomor
      const target = identifier.startsWith('+') ? identifier.substring(1) : identifier;

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': env.WHATSAPP_ACCESS_TOKEN,
        },
        body: new URLSearchParams({
          target: target,
          message: `Kode verifikasi Tokomedia Anda adalah: *${otp}*\n\nKode ini berlaku selama ${env.OTP_EXPIRATION_MINUTES} menit.\nJANGAN BERIKAN KODE INI KEPADA SIAPAPUN.`,
          countryCode: '62',
        }),
      });

      const data = await response.json();

      if (data.status) {
        logger.info(`[Fonnte WhatsApp] Successfully sent OTP to ${target} for ${purpose}`);
        return true;
      } else {
        logger.error(`[Fonnte WhatsApp] Failed to send OTP: ${data.reason || JSON.stringify(data)}`);
        return false;
      }
    } catch (error) {
      logger.error(`[Fonnte WhatsApp] Error sending OTP: ${error}`);
      return false;
    }
  }
}
