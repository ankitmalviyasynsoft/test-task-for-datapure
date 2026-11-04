import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  reorderTasksSchema,
  taskIdParamSchema,
  queryTasksSchema,
} from '../validators/task.validator';

const router = Router();

// Protect all task endpoints with authentication middleware
router.use(authenticate);

// Task Analytics & Metrics
router.get('/stats', TaskController.getTaskStats);

// Batch Reordering (Drag & Drop)
router.patch('/reorder', validate(reorderTasksSchema), TaskController.reorderTasks);

// List & Create
router
  .route('/')
  .get(validate(queryTasksSchema), TaskController.getTasks)
  .post(validate(createTaskSchema), TaskController.createTask);

// Single Task Operations
router
  .route('/:id')
  .get(validate(taskIdParamSchema), TaskController.getTaskById)
  .put(validate(updateTaskSchema), TaskController.updateTask)
  .patch(validate(updateTaskSchema), TaskController.updateTask)
  .delete(validate(taskIdParamSchema), TaskController.deleteTask);

// Quick Status Update
router.patch('/:id/status', validate(updateStatusSchema), TaskController.updateTaskStatus);

export default router;

