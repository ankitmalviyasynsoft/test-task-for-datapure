import React from 'react';
import { Search, Plus, Kanban, ListFilter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { TaskViewMode, TaskFilterState } from '../../types/task';
import { SORT_OPTIONS } from '../../lib/constants';
import { useColumns } from '../../contexts/ColumnContext';

interface ToolbarProps {
  filters: TaskFilterState;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onSortChange: (sortBy: TaskFilterState['sortBy'], sortOrder: 'asc' | 'desc') => void;
  onResetFilters: () => void;
  viewMode: TaskViewMode;
  onViewModeChange: (mode: TaskViewMode) => void;
  onOpenCreateModal: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  filters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
  onOpenCreateModal,
}) => {
  const { columns } = useColumns();
  const currentSortVal = `${filters.sortBy}_${filters.sortOrder}`;

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm py-2.5 pl-10 pr-9 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode & New Task CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3 self-end lg:self-auto w-full sm:w-auto justify-between sm:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <Button
            onClick={onOpenCreateModal}
            leftIcon={<Plus className="w-4 h-4" />}
            size="md"
            className="shadow-sm"
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 text-sm">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium pr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <div className="w-40">
          <Select
            value={filters.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="py-1.5 text-xs rounded-lg"
            options={[
              { value: 'all', label: 'All Statuses' },
              ...columns.map((c) => ({ value: c.key, label: c.label })),
            ]}
          />
        </div>

        {/* Priority Filter */}
        <div className="w-36">
          <Select
            value={filters.priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="py-1.5 text-xs rounded-lg"
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
        </div>

        {/* Sort selector */}
        <div className="w-44">
          <Select
            value={currentSortVal}
            onChange={(e) => {
              const opt = SORT_OPTIONS.find((s) => s.value === e.target.value);
              if (opt) {
                onSortChange(opt.sortBy as TaskFilterState['sortBy'], opt.sortOrder as 'asc' | 'desc');
              }
            }}
            className="py-1.5 text-xs rounded-lg"
            options={SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-1 h-8"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

