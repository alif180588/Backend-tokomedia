import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token tidak ditemukan');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.userId };
    next();
  } catch (err: any) {
    if (err instanceof UnauthorizedError) {
      return next(err);
    }
    next(new UnauthorizedError('Token tidak valid atau sudah kedaluwarsa'));
  }
}
