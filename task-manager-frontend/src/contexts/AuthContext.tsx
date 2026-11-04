'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: { name: string; email: string; password: string }) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load and verify initial auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = AuthService.getStoredUser();
      const hasToken = AuthService.isAuthenticated();

      if (hasToken && storedUser) {
        setUser(storedUser);
        try {
          // Verify with backend silently
          const freshUser = await AuthService.getMe();
          setUser(freshUser);
        } catch {
          // Token expired or invalid
          AuthService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    const { user } = await AuthService.login(credentials);
    setUser(user);
    router.push('/dashboard');
  }, [router]);

  const register = useCallback(async (credentials: { name: string; email: string; password: string }) => {
    const { user } = await AuthService.register(credentials);
    setUser(user);
    router.push('/dashboard');
  }, [router]);

  const googleLogin = useCallback(async (idToken: string) => {
    const { user } = await AuthService.googleLogin(idToken);
    setUser(user);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

