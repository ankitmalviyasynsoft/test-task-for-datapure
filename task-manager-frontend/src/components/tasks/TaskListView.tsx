'use client';

import React from 'react';
import { Task, TaskStatus } from '../../types/task';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { formatDate, formatDueDateBadge } from '../../lib/utils';
import { Edit3, Trash2, Calendar } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Select } from '../ui/Select';
import { TableRowSkeleton } from '../ui/Skeleton';
import { useColumns } from '../../contexts/ColumnContext';

interface TaskListViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onOpenCreateModal: () => void;
  isLoading?: boolean;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreateModal,
  isLoading = false,
}) => {
  const { columns } = useColumns();
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Title & Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((idx) => (
                <TableRowSkeleton key={idx} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="There are no tasks matching your filters or search criteria."
        actionText="Create a new task"
        onAction={onOpenCreateModal}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Title & Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
            {tasks.map((task) => {
              const { text: dueDateText, isPastDue } = formatDueDateBadge(task.dueDate);

              return (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Title & Description */}
                  <td className="py-4 px-4 sm:px-6 max-w-md">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
                      {task.title}
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Status with quick change select */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="w-36">
                      <Select
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                        className="py-1 px-2.5 text-xs font-medium rounded-lg"
                        options={columns.map((c) => ({ value: c.key, label: c.label }))}
                      />
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Due Date */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {task.dueDate ? (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar
                          className={`w-3.5 h-3.5 ${
                            isPastDue && task.status !== 'completed'
                              ? 'text-rose-500'
                              : 'text-slate-400'
                          }`}
                        />
                        <span
                          className={
                            isPastDue && task.status !== 'completed'
                              ? 'text-rose-600 dark:text-rose-400 font-medium'
                              : 'text-slate-600 dark:text-slate-400'
                          }
                        >
                          {dueDateText}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">None</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

