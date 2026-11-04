import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must not exceed 100 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string({ required_error: 'Google ID token is required' }).min(10, 'Invalid Google token'),
  }),
});

export const updateColumnsSchema = z.object({
  body: z.object({
    columns: z
      .array(
        z.object({
          key: z.string().trim().min(1, 'Column key cannot be empty'),
          label: z.string().trim().min(1, 'Column label cannot be empty'),
          color: z.string().optional().default(''),
          bg: z.string().optional().default(''),
          dot: z.string().optional().default(''),
        })
      )
      .min(1, 'At least one column must be configured'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>['body'];
export type UpdateColumnsInput = z.infer<typeof updateColumnsSchema>['body'];

