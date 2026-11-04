import { Types } from 'mongoose';
import { Task } from '../models/task.model';
import { ApiError } from '../utils/apiError';
import { ITaskDoc, TaskStatsResponse, TaskFilterParams } from '../types';
import {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateStatusInput,
  ReorderTasksInput,
} from '../validators/task.validator';

export class TaskService {
  /**
   * Create a new task owned by the user
   */
  static async createTask(userId: string, data: CreateTaskInput): Promise<ITaskDoc> {
    // If order is default 0, calculate next order in this status
    let order = data.order ?? 0;
    if (order === 0) {
      const highestTask = await Task.findOne({
        user: new Types.ObjectId(userId),
        status: data.status,
      })
        .sort({ order: -1 })
        .select('order');
      order = highestTask ? highestTask.order + 1 : 0;
    }

    const task = await Task.create({
      user: new Types.ObjectId(userId),
      title: data.title,
      description: data.description ?? '',
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      order,
    });

    return task;
  }

  /**
   * List tasks for the user with search, filters, sorting, and pagination
   */
  static async getTasks(
    userId: string,
    params: TaskFilterParams
  ): Promise<{ tasks: ITaskDoc[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = params.page ? Math.max(1, Number(params.page)) : 1;
    const limit = params.limit ? Math.min(100, Math.max(1, Number(params.limit))) : 50;
    const skip = (page - 1) * limit;

    // Strict user scoping
    const query: Record<string, unknown> = {
      user: new Types.ObjectId(userId),
    };

    // Filter by Status
    if (params.status) {
      query.status = params.status;
    }

    // Filter by Priority
    if (params.priority) {
      query.priority = params.priority;
    }

    // Search filter across title and description
    if (params.search && params.search.trim().length > 0) {
      const searchRegex = new RegExp(params.search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Date range filter
    if (params.startDate || params.endDate) {
      const dateFilter: Record<string, Date> = {};
      if (params.startDate) {
        dateFilter.$gte = new Date(params.startDate);
      }
      if (params.endDate) {
        dateFilter.$lte = new Date(params.endDate);
      }
      query.dueDate = dateFilter;
    }

    // Sorting
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;
    const sortOptions: Record<string, 1 | -1> = {};

    if (sortBy === 'order') {
      sortOptions.order = 1;
      sortOptions.createdAt = -1;
    } else {
      sortOptions[sortBy] = sortOrder;
    }

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortOptions).skip(skip).limit(limit),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      tasks,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get a single task by ID (ensuring ownership)
   */
  static async getTaskById(userId: string, taskId: string): Promise<ITaskDoc> {
    const task = await Task.findOne({
      _id: new Types.ObjectId(taskId),
      user: new Types.ObjectId(userId),
    });

    if (!task) {
      throw ApiError.notFound('Task not found or you do not have permission to access it.');
    }

    return task;
  }

  /**
   * Update task fields (ensuring ownership)
   */
  static async updateTask(userId: string, taskId: string, data: UpdateTaskInput): Promise<ITaskDoc> {
    const task = await Task.findOne({
      _id: new Types.ObjectId(taskId),
      user: new Types.ObjectId(userId),
    });

    if (!task) {
      throw ApiError.notFound('Task not found or you do not have permission to modify it.');
    }

    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.status !== undefined) task.status = data.status;
    if (data.priority !== undefined) task.priority = data.priority;
    if (data.dueDate !== undefined) {
      task.dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
    }
    if (data.order !== undefined) task.order = data.order;

    await task.save();
    return task;
  }

  /**
   * Quick status & order update (for drag-and-drop kanban card moves)
   */
  static async updateTaskStatus(
    userId: string,
    taskId: string,
    data: UpdateStatusInput
  ): Promise<ITaskDoc> {
    const task = await Task.findOne({
      _id: new Types.ObjectId(taskId),
      user: new Types.ObjectId(userId),
    });

    if (!task) {
      throw ApiError.notFound('Task not found or you do not have permission to modify it.');
    }

    task.status = data.status;
    if (data.order !== undefined) {
      task.order = data.order;
    }

    await task.save();
    return task;
  }

  /**
   * Batch reorder tasks (useful when reordering cards in Kanban or lists)
   */
  static async reorderTasks(userId: string, data: ReorderTasksInput): Promise<{ updatedCount: number }> {
    const userObjectId = new Types.ObjectId(userId);

    const bulkOps = data.tasks.map((item) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(item.id), user: userObjectId },
        update: { $set: { status: item.status, order: item.order } },
      },
    }));

    const result = await Task.bulkWrite(bulkOps);
    return { updatedCount: result.modifiedCount };
  }

  /**
   * Delete task by ID (ensuring ownership)
   */
  static async deleteTask(userId: string, taskId: string): Promise<ITaskDoc> {
    const task = await Task.findOneAndDelete({
      _id: new Types.ObjectId(taskId),
      user: new Types.ObjectId(userId),
    });

    if (!task) {
      throw ApiError.notFound('Task not found or you do not have permission to delete it.');
    }

    return task;
  }

  /**
   * Get user task statistics and metrics
   */
  static async getTaskStats(userId: string): Promise<TaskStatsResponse> {
    const userObjectId = new Types.ObjectId(userId);
    const now = new Date();

    const [statusCounts, overdueCount, highPriorityCount] = await Promise.all([
      Task.aggregate([
        { $match: { user: userObjectId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.countDocuments({
        user: userObjectId,
        dueDate: { $lt: now },
        status: { $ne: 'completed' },
      }),
      Task.countDocuments({
        user: userObjectId,
        priority: 'high',
        status: { $ne: 'completed' },
      }),
    ]);

    let pending = 0;
    let inProgress = 0;
    let completed = 0;

    for (const item of statusCounts) {
      if (item._id === 'pending') pending = item.count;
      else if (item._id === 'in_progress') inProgress = item.count;
      else if (item._id === 'completed') completed = item.count;
    }

    const total = pending + inProgress + completed;

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue: overdueCount,
      highPriority: highPriorityCount,
    };
  }
}

