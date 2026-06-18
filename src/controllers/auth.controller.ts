import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  
  static async requestRegisterOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, channel } = req.body;
      const result = await AuthService.requestOtp(identifier, channel, 'register');
      res.json({
        success: true,
        message: 'Kode verifikasi berhasil dikirim',
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async verifyRegisterOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { challenge_id, otp, full_name } = req.body;
      const deviceInformation = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const result = await AuthService.verifyRegisterOtp(challenge_id, otp, full_name, deviceInformation, ipAddress);
      res.json({
        success: true,
        message: 'Registrasi berhasil',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async requestLoginOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, channel } = req.body;
      const result = await AuthService.requestOtp(identifier, channel, 'login');
      res.json({
        success: true,
        message: 'Kode verifikasi berhasil dikirim',
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async verifyLoginOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { challenge_id, otp } = req.body;
      const deviceInformation = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const result = await AuthService.verifyLoginOtp(challenge_id, otp, deviceInformation, ipAddress);
      res.json({
        success: true,
        message: 'Login berhasil',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { challenge_id } = req.body;
      const result = await AuthService.resendOtp(challenge_id);
      res.json({
        success: true,
        message: 'Kode verifikasi berhasil dikirim ulang',
        ...result
      });
    } catch (err) {
      next(err);
    }
  }
}
