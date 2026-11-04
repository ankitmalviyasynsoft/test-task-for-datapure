import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  updateColumnsSchema,
} from '../validators/auth.validator';
import { authenticate } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Apply auth rate limiter to public auth endpoints
router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/google', authLimiter, validate(googleAuthSchema), AuthController.googleAuth);

// Protected user profile & column endpoints
router.get('/me', authenticate, AuthController.getMe);
router.put('/columns', authenticate, validate(updateColumnsSchema), AuthController.updateColumns);

export default router;

