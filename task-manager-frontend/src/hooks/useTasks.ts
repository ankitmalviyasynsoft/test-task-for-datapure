'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStats, TaskFilterState, TaskStatus, TaskPriority } from '../types/task';
import { TaskService } from '../services/taskService';
import { useToast } from '../contexts/ToastContext';
import { getErrorMessage } from '../services/apiClient';
import { useDebounce } from './useDebounce';

const initialFilters: TaskFilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    highPriority: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<TaskFilterState>(initialFilters);
  const debouncedSearch = useDebounce(filters.search, 300);
  const toast = useToast();

  // Fetch tasks and stats
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [taskRes, statsRes] = await Promise.all([
        TaskService.getTasks({
          ...filters,
          search: debouncedSearch,
        }),
        TaskService.getStats(),
      ]);

      setTasks(taskRes.tasks);
      setStats(statsRes);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.priority, filters.sortBy, filters.sortOrder, debouncedSearch, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create Task
  const createTask = async (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
  }) => {
    try {
      const newTask = await TaskService.createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Task created successfully');
      // Refresh stats
      TaskService.getStats().then(setStats).catch(() => {});
      return newTask;
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  // Update Task
  const updateTask = async (
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string | null;
    }
  ) => {
    try {
      const updated = await TaskService.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success('Task updated successfully');
      TaskService.getStats().then(setStats).catch(() => {});
      return updated;
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  // Quick Status Update (with Optimistic UI for drag & drop)
  const updateTaskStatus = async (id: string, newStatus: TaskStatus, newOrder?: number) => {
    // Save previous state for rollback on error
    const previousTasks = [...tasks];

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus, order: newOrder ?? t.order } : t))
    );

    try {
      await TaskService.updateTaskStatus(id, newStatus, newOrder);
      TaskService.getStats().then(setStats).catch(() => {});
    } catch (err) {
      // Rollback
      setTasks(previousTasks);
      toast.error('Failed to update task status: ' + getErrorMessage(err));
      throw err;
    }
  };

  // Delete Task
  const deleteTask = async (id: string) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await TaskService.deleteTask(id);
      toast.success('Task deleted successfully');
      TaskService.getStats().then(setStats).catch(() => {});
    } catch (err) {
      setTasks(previousTasks);
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  // Filter setters
  const setSearch = (search: string) => setFilters((prev) => ({ ...prev, search }));
  const setStatusFilter = (status: string) => setFilters((prev) => ({ ...prev, status }));
  const setPriorityFilter = (priority: string) => setFilters((prev) => ({ ...prev, priority }));
  const setSorting = (sortBy: TaskFilterState['sortBy'], sortOrder: 'asc' | 'desc') =>
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  const resetFilters = () => setFilters(initialFilters);

  return {
    tasks,
    stats,
    loading,
    filters,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    refreshTasks: fetchTasks,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setSorting,
    resetFilters,
  };
}

