import { X, Edit2 } from "lucide-react";
import { useState } from "react";
import { tasksApi, Task } from "../api/tasks";
import { useToast } from "./Toast";

interface TaskDetailViewProps {
  task: Task;
  onClose: () => void;
  onStatusChange: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskDetailView({ task, onClose, onStatusChange, onEdit, onDelete }: TaskDetailViewProps) {
  const { show: showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleStatus = async () => {
    const next = task.status === "completed" ? "in-progress" : "completed";
    setSaving(true);
    try {
      await tasksApi.status(task._id, next);
      showToast("Status updated");
      onStatusChange({ ...task, status: next });
    } catch (e: any) {
      showToast(e.message || "Failed to update status", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;
    setDeleting(true);
    try {
      await tasksApi.remove(task._id);
      showToast("Task deleted");
      onDelete(task);
    } catch (e: any) {
      showToast(e.message || "Failed to delete", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-slate-900/40" role="dialog" aria-modal="true">
      <div className="max-w-\[430px\] rounded-t-\[28px\] bg-white p-5 shadow-soft mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Task Details</h2>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="icon-button text-slate-500 hover:text-royal hover:bg-slate-100"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-slate-500">Title</p>
          <p className={"text-base font-medium " + (task.status === "completed" ? "text-slate-400 line-through" : "text-slate-800")}>
            {task.title}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-sm text-slate-500">Start</p>
            <p className="text-sm font-medium">{task.startTime}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Ends</p>
            <p className="text-sm font-medium">{task.endTime || "\u2014"}</p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-slate-500">Date</p>
          <p className="text-sm font-medium">{task.date}</p>
        </div>

        <div className="mb-3">
          <p className="text-sm text-slate-500">Priority</p>
          <p className="text-sm font-medium">{task.priority}</p>
        </div>

        {task.description && (
          <div className="mb-3">
            <p className="text-sm text-slate-500">Description</p>
            <p className="text-sm text-slate-800">{task.description}</p>
          </div>
        )}

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <span className={"text-sm font-medium " + (task.status === "completed" ? "text-royal" : "text-slate-600")}>
              {task.status === "completed" ? "Completed" : "In Progress"}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleStatus}
              disabled={saving}
              className={"min-h-11 flex-1 rounded-xl border px-3 text-sm font-medium transition-colors " + (task.status === "completed"
                ? "bg-white border-slate-300 text-slate-600 hover:border-royal"
                : "bg-royal border-royal text-white")}
            >
              {saving ? "Saving..." : task.status === "completed" ? "Mark In Progress" : "Mark Complete"}
            </button>

            <button
              onClick={() => { onEdit(task); onClose(); }}
              disabled={deleting}
              className="min-h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:border-royal hover:text-royal transition-colors flex items-center gap-2"
            >
              <Edit2 size={16} /> Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="min-h-11 rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
