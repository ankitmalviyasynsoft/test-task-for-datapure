import { KanbanColumnDef } from './task';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'local' | 'google';
  columns?: KanbanColumnDef[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

