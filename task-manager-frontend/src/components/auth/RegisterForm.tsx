'use client';

import React from 'react';
import { GoogleButton } from './GoogleButton';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  return (
    <div className="w-full max-w-md p-8 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Get started in seconds with your Google account
        </p>
      </div>

      <div className="mb-6">
        <GoogleButton text="signup_with" />
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3 mt-6">
        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          No passwords required. Your account will be created automatically upon first Google login.
        </p>
      </div>
    </div>
  );
};
