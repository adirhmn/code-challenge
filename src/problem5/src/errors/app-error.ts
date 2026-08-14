export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details: any;

  constructor(message: string, statusCode: number = 500, errorCode: string = 'INTERNAL_SERVER_ERROR', details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details: any = null) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized: Invalid or missing API key', details: any = null) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', details: any = null) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details: any = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}
