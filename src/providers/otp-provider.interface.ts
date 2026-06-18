export interface OtpProvider {
  sendOtp(identifier: string, otp: string, purpose: 'register' | 'login'): Promise<boolean>;
}
