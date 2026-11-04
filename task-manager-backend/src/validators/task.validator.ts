import { z } from 'zod';

const statusEnum = z
  .string({ required_error: 'Status is required' })
  .trim()
  .min(1, 'Status cannot be empty')
  .max(50, 'Status cannot exceed 50 characters');

const priorityEnum = z.enum(['low', 'medium', 'high'], {
  errorMap: () => ({ message: 'Priority must be low, medium, or high' }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(1, 'Title cannot be empty')
      .max(150, 'Title cannot exceed 150 characters'),
    description: z
      .string()
      .trim()
      .max(2000, 'Description cannot exceed 2000 characters')
      .optional()
      .default(''),
    status: statusEnum.optional().default('pending'),
    priority: priorityEnum.optional().default('medium'),
    dueDate: z
      .string()
      .datetime({ offset: true, message: 'Due date must be a valid ISO 8601 string' })
      .nullable()
      .optional()
      .or(z.literal('').transform(() => null)),
    order: z.number().int().nonnegative().optional().default(0),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format'),
  }),
  body: z
    .object({
      title: z.string().trim().min(1, 'Title cannot be empty').max(150).optional(),
      description: z.string().trim().max(2000).optional(),
      status: statusEnum.optional(),
      priority: priorityEnum.optional(),
      dueDate: z
        .string()
        .datetime({ offset: true, message: 'Due date must be a valid ISO 8601 string' })
        .nullable()
        .optional()
        .or(z.literal('').transform(() => null)),
      order: z.number().int().nonnegative().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

export const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format'),
  }),
  body: z.object({
    status: statusEnum,
    order: z.number().int().nonnegative().optional(),
  }),
});

export const reorderTasksSchema = z.object({
  body: z.object({
    tasks: z.array(
      z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID'),
        status: statusEnum,
        order: z.number().int().nonnegative(),
      })
    ).min(1, 'At least one task must be provided for reordering'),
  }),
});

export const taskIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format'),
  }),
});

export const queryTasksSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'title', 'order']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .refine((val) => val > 0, 'Page must be > 0')
      .optional()
      .default('1'),
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
      .optional()
      .default('50'),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>['body'];
export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>['body'];
export type QueryTasksInput = z.infer<typeof queryTasksSchema>['query'];

