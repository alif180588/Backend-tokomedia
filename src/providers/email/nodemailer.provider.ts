import { OtpProvider } from '../otp-provider.interface';
import { env } from '../../config/environment';
import nodemailer from 'nodemailer';

export class NodemailerProvider implements OtpProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USERNAME,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  async sendOtp(to: string, otp: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_ADDRESS || env.SMTP_USERNAME}>`,
        to: to,
        subject: "Kode Verifikasi Tokomedia Anda",
        text: `Kode OTP Anda adalah: ${otp}. JANGAN BERIKAN KODE INI KEPADA SIAPAPUN.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2 style="color: #03AC0E;">Tokomedia</h2>
            <p>Kode Verifikasi (OTP) Anda adalah:</p>
            <h1 style="letter-spacing: 5px; color: #333;">${otp}</h1>
            <p style="color: #777; font-size: 12px;">PENTING: JANGAN BERIKAN kode ini kepada SIAPAPUN, termasuk pihak Tokomedia.</p>
          </div>
        `,
      });

      console.log(`[Nodemailer] Successfully sent email OTP to ${to}. Message ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[Nodemailer] Failed to send email OTP:`, error);
      return false;
    }
  }
}
