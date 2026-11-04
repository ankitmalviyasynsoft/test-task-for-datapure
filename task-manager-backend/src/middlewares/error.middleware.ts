import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { ResponseFormatter } from '../utils/apiResponse';
import { env } from '../config/env';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  name: string;
  path?: string;
  value?: unknown;
}

export const errorHandler = (
  err: Error | ApiError | MongoError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: Record<string, string[]> | string | undefined = undefined;

  // Handled ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Mongoose CastError (e.g. invalid ObjectId)
  else if (err.name === 'CastError') {
    const castErr = err as MongoError;
    statusCode = 400;
    message = `Invalid format for resource identifier: ${castErr.value}`;
  }
  // Mongoose Duplicate Key Error
  else if ((err as MongoError).code === 11000) {
    const mongoErr = err as MongoError;
    const field = mongoErr.keyValue ? Object.keys(mongoErr.keyValue)[0] : 'field';
    statusCode = 409;
    message = `An account or record with this ${field} already exists.`;
  }
  // Generic / Unhandled Error
  else {
    if (env.NODE_ENV !== 'test') {
      console.error('[Unhandled Error]', err);
    }
    message = env.NODE_ENV === 'production' ? 'An unexpected error occurred. Please try again.' : err.message;
  }

  ResponseFormatter.error(res, statusCode, message, errors);
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

