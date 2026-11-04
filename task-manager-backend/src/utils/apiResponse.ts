import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseFormatter {
  static success<T>(
    res: Response,
    data?: T,
    message = 'Success',
    statusCode = 200,
    meta?: ApiResponse['meta']
  ): Response {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data?: T, message = 'Resource created successfully'): Response {
    return ResponseFormatter.success(res, data, message, 201);
  }

  static error(
    res: Response,
    statusCode: number,
    message: string,
    errors?: Record<string, string[]> | string
  ): Response {
    const payload: ApiResponse = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(payload);
  }
}

