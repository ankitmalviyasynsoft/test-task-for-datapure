'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { StatsOverview } from '../../../components/dashboard/StatsOverview';
import { Toolbar } from '../../../components/dashboard/Toolbar';
import { KanbanBoard } from '../../../components/kanban/KanbanBoard';
import { TaskListView } from '../../../components/tasks/TaskListView';
import { TaskModal } from '../../../components/tasks/TaskModal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import { useTasks } from '../../../hooks/useTasks';
import { Task, TaskStatus, TaskPriority, TaskViewMode } from '../../../types/task';
import { STORAGE_KEYS } from '../../../lib/constants';

export default function DashboardPage() {
  const {
    tasks,
    stats,
    loading,
    filters,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setSorting,
    resetFilters,
  } = useTasks();

  const [viewMode, setViewMode] = useState<TaskViewMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(STORAGE_KEYS.VIEW) as TaskViewMode) || 'kanban';
    }
    return 'kanban';
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewModeChange = (mode: TaskViewMode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.VIEW, mode);
    }
  };

  const handleOpenCreateModal = (defaultStatus?: TaskStatus) => {
    setTaskToEdit(
      defaultStatus
        ? ({ status: defaultStatus, priority: 'medium', title: '', description: '' } as Task)
        : null
    );
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
  }) => {
    if (taskToEdit && taskToEdit.id) {
      await updateTask(taskToEdit.id, data);
    } else {
      await createTask(data);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus, newIndex: number) => {
    await updateTaskStatus(taskId, newStatus, newIndex);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Workspace Greeting & Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Task Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your daily workflow, monitor progress, and coordinate tasks effortlessly.
          </p>
        </div>

        {/* Real-time Task Statistics */}
        <ErrorBoundary title="Failed to display task metrics">
          <StatsOverview stats={stats} isLoading={loading} />
        </ErrorBoundary>

        {/* Controls Toolbar: Search, Filters, View switcher, New Task button */}
        <Toolbar
          filters={filters}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onSortChange={setSorting}
          onResetFilters={resetFilters}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onOpenCreateModal={() => handleOpenCreateModal()}
        />

        {/* Main View: Kanban Board vs List View */}
        <ErrorBoundary title="Failed to render task board">
          {viewMode === 'kanban' ? (
            <KanbanBoard
              tasks={tasks}
              onTaskMove={handleTaskMove}
              onEditTask={handleOpenEditModal}
              onDeleteTask={(task) => setTaskToDelete(task)}
              onQuickAdd={(status) => handleOpenCreateModal(status)}
              isLoading={loading}
            />
          ) : (
            <TaskListView
              tasks={tasks}
              onEdit={handleOpenEditModal}
              onDelete={(task) => setTaskToDelete(task)}
              onStatusChange={(id, status) => updateTaskStatus(id, status)}
              onOpenCreateModal={() => handleOpenCreateModal()}
              isLoading={loading}
            />
          )}
        </ErrorBoundary>

        {/* Task Creation & Editing Modal */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setTaskToEdit(null);
          }}
          onSubmit={handleTaskSubmit}
          taskToEdit={taskToEdit}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Task"
          message={`Are you sure you want to permanently delete "${taskToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          isLoading={isDeleting}
        />
      </div>
    </AppLayout>
  );
}

