'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center animate-slide-up">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          Unable to display this view
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {error?.message || 'An error occurred while loading this section of the dashboard.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="md" className="gap-2">
            <RotateCcw className="w-4 h-4" /> Reload view
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="md" className="w-full gap-2">
              <LayoutDashboard className="w-4 h-4" /> Refresh Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

