import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { UnauthorizedError } from '../errors/app-error';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const apiKeyHeader = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!apiKeyHeader || apiKeyHeader !== env.API_KEY) {
    return next(new UnauthorizedError('Unauthorized: Invalid or missing API key. Provide valid x-api-key header.'));
  }

  return next();
}
