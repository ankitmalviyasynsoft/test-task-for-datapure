import React from 'react';
import { TaskStatus, TaskPriority } from '../../types/task';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../lib/constants';
import { useColumns } from '../../contexts/ColumnContext';
import { cn } from '../../lib/utils';

export const StatusBadge: React.FC<{ status: TaskStatus; className?: string }> = ({
  status,
  className,
}) => {
  const { columns } = useColumns();
  const meta =
    columns.find((c) => c.key === status) ||
    TASK_STATUSES.find((s) => s.key === status) || {
      key: status,
      label: status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      color: 'text-slate-700 dark:text-slate-300',
      bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400',
    };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        meta.bg,
        meta.color,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TaskPriority; className?: string }> = ({
  priority,
  className,
}) => {
  const meta = TASK_PRIORITIES.find((p) => p.key === priority) || TASK_PRIORITIES[0];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border uppercase tracking-wider',
        meta.bg,
        meta.color,
        meta.border,
        className
      )}
    >
      {meta.label}
    </span>
  );
};

