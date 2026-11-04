'use client';

import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Task, TaskStatus, KanbanColumnDef } from '../../types/task';
import { TaskCard } from '../tasks/TaskCard';
import { Plus, Trash2 } from 'lucide-react';

interface KanbanColumnProps {
  column: KanbanColumnDef;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onQuickAdd: (status: TaskStatus) => void;
  onDeleteColumn?: (key: string) => void;
  canDelete?: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onEdit,
  onDelete,
  onQuickAdd,
  onDeleteColumn,
  canDelete = false,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 min-h-[500px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 truncate pr-2">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${column.dot || 'bg-slate-400'}`} />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
            {column.label}
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onQuickAdd(column.key)}
            className="p-1 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={`Add task to ${column.label}`}
          >
            <Plus className="w-4 h-4" />
          </button>
          {canDelete && onDeleteColumn && (
            <button
              onClick={() => onDeleteColumn(column.key)}
              className="p-1 text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={`Remove ${column.label} column`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.key}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-col gap-3 rounded-xl p-1 transition-colors min-h-[150px] ${
              snapshot.isDraggingOver
                ? 'bg-primary-light/40 dark:bg-primary/10 ring-2 ring-primary/40 rounded-xl'
                : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={`transition-shadow ${
                      dragSnapshot.isDragging ? 'shadow-xl rotate-1 scale-[1.02]' : ''
                    }`}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      dragHandleProps={dragProvided.dragHandleProps as unknown as Record<string, unknown>}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex-1 flex items-center justify-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                <p className="text-xs text-slate-400">No tasks in this stage</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
