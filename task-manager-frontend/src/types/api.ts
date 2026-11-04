export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]> | string;
  meta?: {
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

