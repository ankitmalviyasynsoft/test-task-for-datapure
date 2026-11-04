import { apiClient } from './apiClient';
import { AuthResponse, User } from '../types/auth';
import { ApiResponse } from '../types/api';
import { STORAGE_KEYS } from '../lib/constants';

export class AuthService {
  static async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const authData = res.data.data!;
    this.saveAuth(authData);
    return authData;
  }

  static async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    const authData = res.data.data!;
    this.saveAuth(authData);
    return authData;
  }

  static async googleLogin(idToken: string): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google', { idToken });
    const authData = res.data.data!;
    this.saveAuth(authData);
    return authData;
  }

  static async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data.data!.user;
  }

  static async updateColumns(columns: any[]): Promise<any[]> {
    const res = await apiClient.put<ApiResponse<{ columns: any[] }>>('/auth/columns', { columns });
    return res.data.data!.columns;
  }

  static saveAuth(auth: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TOKEN, auth.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(auth.user));
    }
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  static getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
}

