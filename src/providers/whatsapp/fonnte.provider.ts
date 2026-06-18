import { OtpProvider } from '../otp-provider.interface';
import { env } from '../../config/environment';

export class FonnteWhatsappProvider implements OtpProvider {
  async sendOtp(to: string, otp: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': env.WHATSAPP_ACCESS_TOKEN, // Kita gunakan env token untuk Fonnte
        },
        body: new URLSearchParams({
          target: to,
          message: `Kode verifikasi Tokomedia Anda adalah: ${otp}. JANGAN BERIKAN KODE INI KEPADA SIAPAPUN.`,
          countryCode: '62', // Optional, default 62
        }),
      });

      const data = await response.json();
      
      if (data.status) {
        console.log(`[Fonnte WhatsApp] Successfully sent OTP to ${to}`);
        return true;
      } else {
        console.error(`[Fonnte WhatsApp] Failed to send OTP:`, data.reason);
        return false;
      }
    } catch (error) {
      console.error(`[Fonnte WhatsApp] Error sending OTP:`, error);
      return false;
    }
  }
}
