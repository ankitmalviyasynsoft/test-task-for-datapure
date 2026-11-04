export type TaskStatus = string;
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskViewMode = 'kanban' | 'list';

export interface KanbanColumnDef {
  key: string;
  label: string;
  color?: string;
  bg?: string;
  dot?: string;
}

export interface Task {
  id: string;
  user: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  highPriority: number;
}

export interface TaskFilterState {
  search: string;
  status: string; // 'all' | TaskStatus
  priority: string; // 'all' | TaskPriority
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title' | 'order';
  sortOrder: 'asc' | 'desc';
}

export interface ReorderItem {
  id: string;
  status: TaskStatus;
  order: number;
}

