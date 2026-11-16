import api from './client';

export interface Task {
  _id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface WeekSummary {
  completed: number;
  pending: number;
  progressPercent: number;
}

export interface WeekCard {
  weekStart: string;
  weekEnd: string;
  open: number;
  completed: number;
  total: number;
}

export type TaskFormInput = Omit<Task, '_id' | 'createdAt' | 'updatedAt'>;

export const tasksApi = {
  list: (params?: { date?: string; weekStart?: string }) =>
    api.get('/tasks', { params }),
  weeks: () => api.get('/tasks/weeks'),
  summary: (weekStart: string) =>
    api.get('/tasks/summary', { params: { weekStart } }),
  search: (q: string) => api.get('/tasks/search', { params: { q } }),
  create: (data: TaskFormInput) => api.post('/tasks', data),
  update: (id: string, data: Partial<TaskFormInput>) =>
    api.put(`/tasks/${id}`, data),
  status: (id: string, status: Task['status']) =>
    api.patch(`/tasks/${id}/status`, { status }),
  remove: (id: string) => api.delete(`/tasks/${id}`),
};