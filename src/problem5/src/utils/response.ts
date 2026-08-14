import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200, meta?: PaginationMeta) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function sendError(res: Response, message: string, statusCode: number = 500, errorCode: string = 'INTERNAL_ERROR', details: any = null) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details ? { details } : {}),
    },
  });
}
