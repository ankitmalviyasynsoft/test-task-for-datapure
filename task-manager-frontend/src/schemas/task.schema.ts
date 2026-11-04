import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z
    .string()
    .trim()
    .max(2000, 'Description cannot exceed 2000 characters')
    .default(''),
  status: z
    .string({ required_error: 'Status is required' })
    .trim()
    .min(1, 'Status cannot be empty'),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Priority is required',
  }),
  dueDate: z.string().optional().nullable(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

