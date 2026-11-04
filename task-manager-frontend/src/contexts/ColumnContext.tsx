'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { KanbanColumnDef } from '../types/task';
import { useAuth } from './AuthContext';
import { AuthService } from '../services/authService';
import { useToast } from './ToastContext';

export const DEFAULT_COLUMNS: KanbanColumnDef[] = [
  {
    key: 'pending',
    label: 'Pending',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  {
    key: 'completed',
    label: 'Completed',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
];

const COLUMN_COLORS = [
  { dot: 'bg-violet-500', color: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800' },
  { dot: 'bg-pink-500', color: 'text-pink-700 dark:text-pink-300', bg: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800' },
  { dot: 'bg-cyan-500', color: 'text-cyan-700 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800' },
  { dot: 'bg-rose-500', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
  { dot: 'bg-teal-500', color: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800' },
];

interface ColumnContextType {
  columns: KanbanColumnDef[];
  addColumn: (name: string) => Promise<boolean>;
  deleteColumn: (key: string) => Promise<void>;
  resetColumns: () => Promise<void>;
  loading: boolean;
}

const ColumnContext = createContext<ColumnContextType | undefined>(undefined);

export const ColumnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [columns, setColumns] = useState<KanbanColumnDef[]>(DEFAULT_COLUMNS);
  const [loading, setLoading] = useState(false);

  // Sync columns from user document stored in Database
  useEffect(() => {
    if (user && user.columns && Array.isArray(user.columns) && user.columns.length > 0) {
      setColumns(user.columns);
    } else {
      setColumns(DEFAULT_COLUMNS);
    }
  }, [user]);

  // Persist column changes to database
  const persistColumns = useCallback(
    async (newCols: KanbanColumnDef[]) => {
      setColumns(newCols);
      if (!user) return;
      try {
        setLoading(true);
        await AuthService.updateColumns(newCols);
      } catch {
        toast.error('Failed to sync columns to your account.');
      } finally {
        setLoading(false);
      }
    },
    [user, toast]
  );

  const addColumn = async (name: string): Promise<boolean> => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    // Generate unique slug key
    const baseKey = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    let key = baseKey || 'column';
    let counter = 1;
    while (columns.some((c) => c.key === key)) {
      key = `${baseKey}_${counter++}`;
    }

    const colorScheme = COLUMN_COLORS[columns.length % COLUMN_COLORS.length];

    const newCol: KanbanColumnDef = {
      key,
      label: trimmed,
      ...colorScheme,
    };

    const updated = [...columns, newCol];
    await persistColumns(updated);
    toast.success(`Column "${trimmed}" created.`);
    return true;
  };

  const deleteColumn = async (key: string) => {
    if (columns.length <= 1) return;
    const deletedCol = columns.find((c) => c.key === key);
    const filtered = columns.filter((c) => c.key !== key);
    await persistColumns(filtered);
    if (deletedCol) {
      toast.success(`Column "${deletedCol.label}" removed.`);
    }
  };

  const resetColumns = async () => {
    await persistColumns(DEFAULT_COLUMNS);
    toast.success('Columns reset to default.');
  };

  return (
    <ColumnContext.Provider value={{ columns, addColumn, deleteColumn, resetColumns, loading }}>
      {children}
    </ColumnContext.Provider>
  );
};

export const useColumns = () => {
  const context = useContext(ColumnContext);
  if (!context) {
    throw new Error('useColumns must be used within a ColumnProvider');
  }
  return context;
};
