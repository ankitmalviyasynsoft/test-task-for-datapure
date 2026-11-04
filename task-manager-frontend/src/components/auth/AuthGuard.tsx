'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService } from '../../services/authService';
import { Spinner } from '../ui/Spinner';
import { ShieldCheck } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    // Check both AuthContext state and physical token validity in storage
    const hasToken = AuthService.isAuthenticated();

    if (!loading) {
      if (!hasToken || !user) {
        // Redirect to login if user lacks token or session
        const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : '/login';
        router.replace(redirectUrl);
      } else {
        setCheckingToken(false);
      }
    }
  }, [user, loading, router, pathname]);

  // Loading indicator with workspace animation
  if (loading || checkingToken) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="relative mb-4 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="absolute -inset-1 border-2 border-indigo-500/20 rounded-3xl animate-ping pointer-events-none" />
        </div>
        <Spinner size="md" className="text-indigo-600 dark:text-indigo-400 mb-3" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Verifying security & session token...
        </p>
        <p className="text-xs text-slate-400 mt-1">Please wait a moment</p>
      </div>
    );
  }

  // Not authenticated or token absent
  if (!user || !AuthService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};
