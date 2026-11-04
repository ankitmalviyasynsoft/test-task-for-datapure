import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtTokenPayload } from '../types';

export const signToken = (payload: JwtTokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtTokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtTokenPayload;
};

