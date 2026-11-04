import { apiClient } from './apiClient';
import { Task, TaskStats, TaskFilterState, TaskStatus, TaskPriority, ReorderItem } from '../types/task';
import { ApiResponse } from '../types/api';

export class TaskService {
  static async getTasks(filters?: Partial<TaskFilterState>): Promise<{ tasks: Task[]; total: number }> {
    const params: Record<string, string | number> = {
      limit: 100, // retrieve ample tasks for kanban/board display
    };

    if (filters?.search) params.search = filters.search;
    if (filters?.status && filters.status !== 'all') params.status = filters.status;
    if (filters?.priority && filters.priority !== 'all') params.priority = filters.priority;
    if (filters?.sortBy) params.sortBy = filters.sortBy;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    const res = await apiClient.get<ApiResponse<{ tasks: Task[] }>>('/tasks', { params });
    return {
      tasks: res.data.data?.tasks || [],
      total: res.data.meta?.total || 0,
    };
  }

  static async getTaskById(id: string): Promise<Task> {
    const res = await apiClient.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
    return res.data.data!.task;
  }

  static async createTask(data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
  }): Promise<Task> {
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };
    const res = await apiClient.post<ApiResponse<{ task: Task }>>('/tasks', payload);
    return res.data.data!.task;
  }

  static async updateTask(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string | null;
    }
  ): Promise<Task> {
    const payload = {
      ...data,
      dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate).toISOString() : null) : undefined,
    };
    const res = await apiClient.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, payload);
    return res.data.data!.task;
  }

  static async updateTaskStatus(id: string, status: TaskStatus, order?: number): Promise<Task> {
    const res = await apiClient.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}/status`, { status, order });
    return res.data.data!.task;
  }

  static async reorderTasks(tasks: ReorderItem[]): Promise<void> {
    await apiClient.patch('/tasks/reorder', { tasks });
  }

  static async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }

  static async getStats(): Promise<TaskStats> {
    const res = await apiClient.get<ApiResponse<{ stats: TaskStats }>>('/tasks/stats');
    return res.data.data?.stats || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      highPriority: 0,
    };
  }
}

