import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { ResponseFormatter } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { TaskFilterParams } from '../types';

export class TaskController {
  /**
   * Create a new task
   */
  static createTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.createTask(req.user!._id.toString(), req.body);
    return ResponseFormatter.created(res, { task }, 'Task created successfully.');
  });

  /**
   * Get all tasks for the authenticated user with filtering & sorting
   */
  static getTasks = asyncHandler(async (req: Request, res: Response) => {
    const queryParams: TaskFilterParams = req.query;
    const { tasks, total, page, limit, totalPages } = await TaskService.getTasks(
      req.user!._id.toString(),
      queryParams
    );

    return ResponseFormatter.success(
      res,
      { tasks },
      'Tasks retrieved successfully.',
      200,
      { total, page, limit, totalPages }
    );
  });

  /**
   * Get single task by ID
   */
  static getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.getTaskById(req.user!._id.toString(), req.params.id);
    return ResponseFormatter.success(res, { task }, 'Task retrieved successfully.');
  });

  /**
   * Update task fields
   */
  static updateTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.updateTask(
      req.user!._id.toString(),
      req.params.id,
      req.body
    );
    return ResponseFormatter.success(res, { task }, 'Task updated successfully.');
  });

  /**
   * Update task status (and optional order)
   */
  static updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.updateTaskStatus(
      req.user!._id.toString(),
      req.params.id,
      req.body
    );
    return ResponseFormatter.success(res, { task }, 'Task status updated successfully.');
  });

  /**
   * Batch reorder tasks (e.g. drag & drop card positions)
   */
  static reorderTasks = asyncHandler(async (req: Request, res: Response) => {
    const result = await TaskService.reorderTasks(req.user!._id.toString(), req.body);
    return ResponseFormatter.success(res, result, 'Tasks reordered successfully.');
  });

  /**
   * Delete task
   */
  static deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.deleteTask(req.user!._id.toString(), req.params.id);
    return ResponseFormatter.success(res, { task }, 'Task deleted successfully.');
  });

  /**
   * Get task statistics (counts, overdue, priority)
   */
  static getTaskStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await TaskService.getTaskStats(req.user!._id.toString());
    return ResponseFormatter.success(res, { stats }, 'Task statistics retrieved successfully.');
  });
}

