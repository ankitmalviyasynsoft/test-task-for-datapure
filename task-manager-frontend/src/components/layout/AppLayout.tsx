import React from 'react';
import { Navbar } from './Navbar';
import { AuthGuard } from '../auth/AuthGuard';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
};

