'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800',
        className
      )}
    />
  );
};

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-md" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-2/3" />
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-14 rounded-lg" />
      </div>
    </div>
  );
};

export const StatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
          <Skeleton className="h-7 w-14" />
        </div>
      ))}
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/80">
      <td className="py-4 px-4 sm:px-6">
        <Skeleton className="h-4 w-48 mb-1.5" />
        <Skeleton className="h-3 w-72" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-6 w-24 rounded-lg" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex justify-end gap-1">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </td>
    </tr>
  );
};
