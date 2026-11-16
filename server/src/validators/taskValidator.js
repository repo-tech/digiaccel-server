import { z } from 'zod';
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:mm time format');
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD date format');
export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required').max(120),
  description: z.string().trim().max(1000).optional().default(''),
  date, startTime: time, endTime: time.or(z.literal('')).optional().default(''),
  priority: z.enum(['Low', 'Medium', 'High']).optional().default('Medium'),
  status: z.enum(['in-progress', 'completed']).optional()
}).superRefine((value, ctx) => {
  if (value.endTime && value.endTime < value.startTime) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endTime'], message: 'End time must be after start time' });
});
export const statusSchema = z.object({ status: z.enum(['in-progress', 'completed']) });
