import { CalendarDays, Clock3, X } from 'lucide-react';
import { useEffect, useState, FormEvent } from 'react';
import { tasksApi, Task, TaskFormInput } from '../api/tasks';
import { useToast } from './Toast';

const empty = (date: string): TaskFormInput => ({
  title: '',
  description: '',
  date,
  startTime: '09:00',
  endTime: '',
  priority: 'Medium',
  status: 'in-progress',
});

interface TaskSheetProps {
  task?: Task | null;
  date?: string;
  onClose: () => void;
  onSaved: (updated: Task) => void;
}

export default function TaskSheet({ task, date, onClose, onSaved }: TaskSheetProps) {
  const isEdit = Boolean(task?._id);
  const defaultDate = date || new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<TaskFormInput>(task ? { ...task, endTime: task.endTime || '' } : empty(defaultDate));
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormInput, string>>>({});
  const [saving, setSaving] = useState(false);
  const { show: showToast } = useToast();

  useEffect(() => {
    setForm(task ? { ...task, endTime: task.endTime || '' } : empty(defaultDate));
    setErrors({});
  }, [task, date, defaultDate]);

  const set = (key: keyof TaskFormInput, value: string) =>
    setForm((x) => ({ ...x, [key]: value }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof TaskFormInput, string>> = {};
    if (!form.title.trim()) next.title = 'Task title is required';
    if (!form.date) next.date = 'Select a date';
    if (!form.startTime) next.startTime = 'Select a start time';
    if (form.endTime && form.endTime < form.startTime) next.endTime = 'End time must be after start time';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const res = task && task._id
        ? await tasksApi.update(task._id, form)
        : await tasksApi.create(form);
      showToast(task && task._id ? 'Task updated' : 'Task created');
      onSaved(res.data);
    } catch (err: any) {
      setErrors(err.errors || { title: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-slate-900/40" role="dialog" aria-modal="true">
      <form onSubmit={save} className="max-h-[92vh] w-full max-w-[430px] mx-auto overflow-y-auto scrollbar-hide rounded-t-[28px] bg-page p-5 pb-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{task && isEdit? 'Edit Task' : 'Add New Task'}</h2>
          <button type="button" onClick={onClose} className="icon-button" aria-label="Close">
            <X />
          </button>
        </div>

        <label className="block text-sm font-medium mb-2">Task title</label>
        <input
          className={`field ${errors.title ? 'border-red-500' : ''}`}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          maxLength={120}
          placeholder="What needs to be done?"
          autoFocus
        />
        {errors.title && <p className="h-5 text-xs text-red-500">{errors.title}</p>}

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div>
            <label className="mb-2 flex gap-1 text-sm font-medium">
              <Clock3 size={16} /> Start
            </label>
            <input
              className={`field ${errors.startTime ? 'border-red-500' : ''}`}
              type="time"
              value={form.startTime}
              onChange={(e) => set('startTime', e.target.value)}
            />
            {errors.startTime && <p className="h-5 text-xs text-red-500">{errors.startTime}</p>}
          </div>
          <div>
            <label className="mb-2 flex gap-1 text-sm font-medium">
              <Clock3 size={16} /> Ends
            </label>
            <input
              className={`field ${errors.endTime ? 'border-red-500' : ''}`}
              type="time"
              value={form.endTime}
              onChange={(e) => set('endTime', e.target.value)}
            />
            {errors.endTime && <p className="h-5 text-xs text-red-500">{errors.endTime}</p>}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 flex gap-1 text-sm font-medium">
            <CalendarDays size={16} /> Set date
          </label>
          <input
            className={`field ${errors.date ? 'border-red-500' : ''}`}
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
          {errors.date && <p className="h-5 text-xs text-red-500">{errors.date}</p>}
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">Description</label>
          <textarea
            className={`field min-h-[80px] ${errors.description ? 'border-red-500' : ''}`}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            maxLength={1000}
            placeholder="Add details..."
          />
          {errors.description && <p className="h-5 text-xs text-red-500">{errors.description}</p>}
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">Priority</label>
          <div className="grid grid-cols-3 gap-2">
            {['Low', 'Medium', 'High'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set('priority', p as TaskFormInput['priority'])}
                className={`min-h-11 rounded-xl border px-3 text-sm font-medium capitalize transition-colors ${
                  form.priority === p
                    ? 'bg-royal border-royal text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-royal'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-7 min-h-12 w-full rounded-xl bg-royal font-semibold text-white disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? (task ? 'Saving...' : 'Creating...') : task ? 'Save changes' : 'Create task'}
        </button>
      </form>
    </div>
  );
}