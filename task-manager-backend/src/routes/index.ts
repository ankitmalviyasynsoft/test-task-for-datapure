import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import { ResponseFormatter } from '../utils/apiResponse';

const router = Router();

// Health Check
router.get('/health', (_req: Request, res: Response) => {
  return ResponseFormatter.success(res, {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }, 'Service is operational.');
});

// Mount Routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;

