'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { CheckSquare, ArrowRight, Kanban, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Navigation */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <CheckSquare className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            TaskManager<span className="text-indigo-600">.</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8">
          <Zap className="w-3.5 h-3.5" /> Assessment-Ready Task Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
          Manage your tasks with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
            clarity and speed
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Stay organized, track deadlines, and supercharge your productivity with an intuitive
          drag-and-drop Kanban board, powerful filtering, and multi-tenant security.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-auto">
              Start Free Today
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Sign In to Workspace
            </Button>
          </Link>
        </div>

        {/* Features Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Kanban className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Drag & Drop Kanban
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Organize tasks seamlessly across Pending, In Progress, and Completed columns with instant state updates.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Strict Security & Ownership
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Multi-tenant architecture with JWT verification and Google OAuth ensures your tasks are privately yours.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Search & Smart Filtering
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Filter by status, priority, and due dates, or instantly search keywords with real-time debounced queries.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
      </footer>
    </div>
  );
}

