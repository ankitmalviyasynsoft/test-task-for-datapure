import React from 'react';
import { TaskStats } from '../../types/task';
import { CheckCircle2, Clock, ListTodo, AlertTriangle, Flame } from 'lucide-react';
import { StatsSkeleton } from '../ui/Skeleton';

interface StatsOverviewProps {
  stats: TaskStats;
  isLoading?: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return <StatsSkeleton />;
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: <ListTodo className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40',
      badge: `${completionRate}% Done`,
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40',
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      icon: <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
      {statItems.map((item, idx) => (
        <div
          key={idx}
          className={`p-4 sm:p-5 rounded-2xl border ${item.bg} flex flex-col justify-between transition-all duration-200 hover:shadow-sm`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {item.label}
            </span>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
              {item.icon}
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {item.value}
            </span>
            {item.badge && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

