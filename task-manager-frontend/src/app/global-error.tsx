'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Level Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
            Unexpected System Error
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            An application error occurred. We have captured the details and you can try reloading or returning home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} size="md" className="gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" size="md" className="w-full gap-2">
                <Home className="w-4 h-4" /> Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

