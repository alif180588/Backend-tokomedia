import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  logger.error('Unhandled Error:', err);

  return res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server'
  });
}
