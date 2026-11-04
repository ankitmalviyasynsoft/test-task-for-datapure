import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';

export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Authentication token missing or invalid. Please log in.');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw ApiError.unauthorized('Bearer token required');
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    const err = error as { name?: string; message?: string };
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Your session has expired. Please log in again.');
    }
    if (err.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid authentication token.');
    }
    throw ApiError.unauthorized('Authentication failed.');
  }
});

