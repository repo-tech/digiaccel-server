import { X, Edit2, Trash2, Calendar, CheckCircle2, CircleX } from 'lucide-react';
import { useState } from 'react';
import { useConfirm } from '../hooks/useConfirm';
import { Task } from '../api/tasks';
import { tasksApi } from '../api/tasks';
import { useToast } from './Toast';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task) => void;
}

const priorityColor: Record<string, string> = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Medium: 'bg-amber-50 text-amber-700 border-amber-100',
  High: 'bg-rose-50 text-rose-700 border-rose-100',
};

export default function TaskDetail({ task, onClose, onEdit, onDelete, onStatusChange }: TaskDetailProps) {
  const { show: showToast } = useToast();
  const { show } = useConfirm();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = await show({
      title: 'Delete task?',
      message: `“${task.title}” will be removed permanently.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    if (!confirmed) return;
    setDeleting(true);
    try {
      await tasksApi.remove(task._id);
      showToast('Task deleted');
      onDelete(task);
    } catch (e: any) {
      setDeleting(false);
      showToast(e.message || 'Could not delete task', 'error');
    }
  };

  const handleToggle = async () => {
    const next = task.status === 'completed' ? 'in-progress' : 'completed';
    try {
      await tasksApi.status(task._id, next);
      onStatusChange(task);
    } catch (e: any) {
      showToast(e.message || 'Could not update status', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-slate-900/40" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-[430px] mx-auto overflow-y-auto scrollbar-hide rounded-t-[28px] bg-page p-5 pb-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Task Details</h2>
          <button type="button" onClick={onClose} className="icon-button" aria-label="Close">
            <X />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold mb-1">Title</h3>
            <p className={`text-base text-slate-800 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>{task.title}</p>
          </div>

          {task.description && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Description</h3>
              <p className="text-sm text-slate-600">{task.description}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-1">Date &amp; Time</h3>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <Calendar size={16} /> {task.date} · {task.startTime}{task.endTime ? ` – ${task.endTime}` : ''}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Priority</h3>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${priorityColor[task.priority]}`}>
              {task.priority}
            </span>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-1">Status</h3>
            <button
              onClick={handleToggle}
              className={`min-h-10 w-full rounded-xl border px-4 py-2 text-left text-sm font-medium flex items-center justify-between ${
                task.status === 'completed'
                  ? 'bg-done border-royal text-navy'
                  : 'bg-pending border-red-200 text-red-700'
              }`}
            >
              <span>
                {task.status === 'completed' ? <CheckCircle2 size={16} className="mr-2" /> : <CircleX size={16} className="mr-2" />}
                {task.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={() => { onClose(); onEdit(task); }}
            className="min-h-12 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Edit2 size={17} className="mr-2" /> Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`min-h-12 rounded-xl px-4 text-sm font-medium ${deleting ? 'opacity-50 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            {deleting ? 'Deleting...' : <><Trash2 size={17} className="mr-2" /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}