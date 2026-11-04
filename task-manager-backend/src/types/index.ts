import { Document, Types } from 'mongoose';

export type TaskStatus = string;
export type TaskPriority = 'low' | 'medium' | 'high';
export type AuthProvider = 'local' | 'google';

export interface IKanbanColumn {
  key: string;
  label: string;
  color?: string;
  bg?: string;
  dot?: string;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  provider: AuthProvider;
  googleId?: string;
  columns?: IKanbanColumn[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDoc extends Document<Types.ObjectId>, IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITask {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskDoc extends Document<Types.ObjectId>, ITask {}

export interface JwtTokenPayload {
  userId: string;
  email: string;
}

export interface TaskFilterParams {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title' | 'order';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]> | string;
  meta?: {
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface TaskStatsResponse {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  highPriority: number;
}

