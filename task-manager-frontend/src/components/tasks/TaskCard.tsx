'use client';

import React from 'react';
import { Task } from '../../types/task';
import { PriorityBadge } from '../ui/Badge';
import { formatDueDateBadge } from '../../lib/utils';
import { Calendar, Edit3, Trash2, GripVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  dragHandleProps?: Record<string, unknown>;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  dragHandleProps,
}) => {
  const { text: dueDateText, isPastDue } = formatDueDateBadge(task.dueDate);

  return (
    <div className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
      {/* Top Header: Drag handle, Priority, Actions */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 p-0.5 rounded"
            title="Drag to reorder or change status"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 leading-snug line-clamp-2">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Due Date Footer */}
      {task.dueDate && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
          <Calendar
            className={`w-3.5 h-3.5 ${
              isPastDue && task.status !== 'completed'
                ? 'text-rose-500'
                : 'text-slate-400'
            }`}
          />
          <span
            className={`font-medium ${
              isPastDue && task.status !== 'completed'
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {dueDateText}
          </span>
        </div>
      )}
    </div>
  );
};

