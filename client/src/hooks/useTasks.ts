import { useCallback, useEffect, useState } from 'react';
import { tasksApi, Task, WeekSummary } from '../api/tasks';

export function useTasks(params?: { date?: string; weekStart?: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tasksApi.list(params);
      setTasks(res.data);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);
  useEffect(() => {
    load();
  }, [load]);
  return { tasks, setTasks, loading, error, reload: load };
}

export function useWeeklySummary(weekStart: string) {
  const [summary, setSummary] = useState<WeekSummary>({
    completed: 0,
    pending: 0,
    progressPercent: 0,
  });
  const load = useCallback(() => {
    tasksApi.summary(weekStart).then((res) => setSummary(res.data)).catch(() => {});
  }, [weekStart]);
  useEffect(() => {
    load();
  }, [load]);
  return { summary, reload: load };
}