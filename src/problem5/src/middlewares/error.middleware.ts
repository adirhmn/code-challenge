import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { sendError } from '../utils/response';

export function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errorCode, err.details);
  }

  console.error('Unhandled Error:', err);
  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'An internal server error occurred' : err.message,
    500,
    'INTERNAL_SERVER_ERROR'
  );
}
