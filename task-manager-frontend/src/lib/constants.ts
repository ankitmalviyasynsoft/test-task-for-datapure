import { TaskStatus, TaskPriority } from '../types/task';

export const TASK_STATUSES: { key: TaskStatus; label: string; color: string; bg: string; dot: string }[] = [
  { key: 'pending', label: 'Pending', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  { key: 'in_progress', label: 'In Progress', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  { key: 'completed', label: 'Completed', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
];

export const TASK_PRIORITIES: { key: TaskPriority; label: string; color: string; bg: string; border: string }[] = [
  { key: 'low', label: 'Low', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-700' },
  { key: 'medium', label: 'Medium', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40', border: 'border-amber-300 dark:border-amber-800' },
  { key: 'high', label: 'High', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/40', border: 'border-rose-300 dark:border-rose-800' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest first', sortBy: 'createdAt', sortOrder: 'desc' },
  { value: 'createdAt_asc', label: 'Oldest first', sortBy: 'createdAt', sortOrder: 'asc' },
  { value: 'dueDate_asc', label: 'Due date (Earliest)', sortBy: 'dueDate', sortOrder: 'asc' },
  { value: 'dueDate_desc', label: 'Due date (Latest)', sortBy: 'dueDate', sortOrder: 'desc' },
  { value: 'title_asc', label: 'Title (A-Z)', sortBy: 'title', sortOrder: 'asc' },
  { value: 'priority_desc', label: 'Priority', sortBy: 'priority', sortOrder: 'desc' },
];

export const STORAGE_KEYS = {
  TOKEN: 'task_manager_auth_token',
  USER: 'task_manager_user',
  THEME: 'task_manager_theme',
  VIEW: 'task_manager_view',
};

