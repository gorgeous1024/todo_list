import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../types/index.js';

// Zod schemas for validation

export const TaskStatusSchema = z.nativeEnum(TaskStatus);
export const TaskPrioritySchema = z.nativeEnum(TaskPriority);

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  due_date: z.string().datetime().optional(),
  photo: z.string().url().optional(),
  completed: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: TaskStatusSchema.default(TaskStatus.TODO),
  priority: TaskPrioritySchema.default(TaskPriority.MEDIUM),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  due_date: z.string().datetime().optional(),
  photo: z.any().optional(), // File upload will be handled separately
  priority: TaskPrioritySchema.default(TaskPriority.MEDIUM),
  status: TaskStatusSchema.default(TaskStatus.TODO),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  id: z.string().uuid(),
  completed: z.boolean().optional(),
});

export const TaskFilterSchema = z.object({
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  completed: z.boolean().optional(),
  search: z.string().optional(),
  due_date_from: z.string().datetime().optional(),
  due_date_to: z.string().datetime().optional(),
});

export const TaskSortSchema = z.object({
  field: z.enum(['title', 'created_at', 'updated_at', 'due_date', 'priority']),
  direction: z.enum(['asc', 'desc']).default('desc'),
});

// Utility function to validate form data
export function validateTaskData(data: unknown) {
  return CreateTaskSchema.safeParse(data);
}

export function validateUpdateTaskData(data: unknown) {
  return UpdateTaskSchema.safeParse(data);
}

export function validateTaskFilter(data: unknown) {
  return TaskFilterSchema.safeParse(data);
}

export function validateTaskSort(data: unknown) {
  return TaskSortSchema.safeParse(data);
}
