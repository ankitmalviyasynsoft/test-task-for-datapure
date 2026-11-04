'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '../../types/task';
import { KanbanColumn } from './KanbanColumn';
import { TaskCardSkeleton } from '../ui/Skeleton';
import { useColumns } from '../../contexts/ColumnContext';
import { Plus, LayoutGrid } from 'lucide-react';
import { Button } from '../ui/Button';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus, newIndex: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onQuickAdd: (status: TaskStatus) => void;
  isLoading?: boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskMove,
  onEditTask,
  onDeleteTask,
  onQuickAdd,
  isLoading = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const { columns, addColumn, deleteColumn } = useColumns();
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    onTaskMove(draggableId, newStatus, destination.index);
  };

  const handleCreateColumn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newColumnName.trim()) return;
    const ok = await addColumn(newColumnName.trim());
    if (ok) {
      setNewColumnName('');
      setIsAddingColumn(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex gap-5 overflow-x-auto pb-4">
        {[1, 2, 3].map((col) => (
          <div
            key={col}
            className="w-80 shrink-0 flex flex-col gap-3 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 min-h-[500px]"
          >
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2" />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex items-start gap-5 overflow-x-auto pb-6 scrollbar-thin">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          const isDefault = ['pending', 'in_progress', 'completed'].includes(col.key);

          return (
            <div key={col.key} className="w-80 shrink-0">
              <KanbanColumn
                column={col}
                tasks={colTasks}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onQuickAdd={onQuickAdd}
                onDeleteColumn={deleteColumn}
                canDelete={!isDefault}
              />
            </div>
          );
        })}

        {/* Add Column Button / Form */}
        <div className="w-80 shrink-0">
          {isAddingColumn ? (
            <form
              onSubmit={handleCreateColumn}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3 animate-slide-up"
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">New Stage / Column</h4>
              </div>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Under Review, QA, Backlog"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setIsAddingColumn(false);
                    setNewColumnName('');
                  }}
                  className="h-8 px-2.5 text-xs text-slate-500"
                >
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="h-8 px-3 text-xs">
                  Add Column
                </Button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary text-slate-500 hover:text-primary dark:text-slate-400 transition-all bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer font-medium text-xs shadow-xs"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add another column</span>
            </button>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};
