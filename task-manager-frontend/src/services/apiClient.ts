import axios, { AxiosError } from 'axios';
import { STORAGE_KEYS } from '../lib/constants';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthenticated 401
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> | string }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const isAuthPage = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
        if (!isAuthPage) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.location.href = '/login?session_expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errData = error.response?.data;
    if (errData?.message) return errData.message;
    if (typeof errData?.errors === 'string') return errData.errors;
    if (errData?.errors && typeof errData.errors === 'object') {
      const firstKey = Object.keys(errData.errors)[0];
      const val = (errData.errors as Record<string, string[]>)[firstKey];
      if (Array.isArray(val) && val.length > 0) return `${firstKey}: ${val[0]}`;
    }
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred. Please try again.';
}

