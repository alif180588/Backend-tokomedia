import crypto from 'crypto';
import bcrypt from 'bcrypt';

export function generateOtp(length: number = 6): string {
  if (process.env.ENABLE_DEV_OTP === 'true') {
    return '123456'; // Default OTP for development for easier testing
  }
  
  const chars = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    otp += chars[randomIndex];
  }
  return otp;
}

export async function hashOtp(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
}

export async function verifyOtpHash(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}
