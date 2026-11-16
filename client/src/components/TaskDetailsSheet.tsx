import { Calendar, Clock, Edit3, Flag, Trash2, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Task } from "../api/tasks";
import BottomSheet from "./BottomSheet";

interface Props { task: Task; onClose: () => void; onToggle: (task: Task) => void; onEdit: (task: Task) => void; onDelete: (task: Task) => void; }
const toTime = (value: string) => format(new Date(`2000-01-01T${value}`), "hh:mm a");
const styles = { Low: "bg-green-50 text-green-700", Medium: "bg-amber-50 text-amber-700", High: "bg-red-50 text-red-700" };

export default function TaskDetailsSheet({ task, onClose, onToggle, onEdit, onDelete }: Props) {
  const completed = task.status === "completed";
  return <BottomSheet onClose={onClose}>
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Task Details</h2><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
    <div className="mb-5 flex items-start gap-2"><h3 className={`flex-1 text-xl font-semibold ${completed ? "text-slate-400 line-through" : ""}`}>{task.title}</h3><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${completed ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>{completed ? "Completed" : "In Progress"}</span></div>
    <div className="space-y-3 text-sm"><Info icon={<Calendar size={18} />} label="Date" value={format(parseISO(task.date), "EEE, d MMM yyyy")} /><Info icon={<Clock size={18} />} label="Time" value={`${toTime(task.startTime)}${task.endTime ? ` - ${toTime(task.endTime)}` : ""}`} /><Info icon={<Flag size={18} />} label="Priority" value={<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[task.priority]}`}>{task.priority}</span>} /></div>
    <div className="my-5 border-t border-slate-100 pt-4"><p className="mb-1 text-sm font-medium">Description</p><p className="whitespace-pre-wrap text-sm text-slate-600">{task.description || "No description added"}</p></div>
    <button onClick={() => { onToggle(task); onClose(); }} className={`min-h-[44px] w-full whitespace-nowrap rounded-xl border px-3 text-sm font-medium ${completed ? "border-royal text-royal" : "border-royal bg-royal text-white"}`}>{completed ? "Mark as in progress" : "Mark as completed"}</button>
    <div className="mt-2 grid grid-cols-2 gap-2"><button onClick={() => { onEdit(task); onClose(); }} className="flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 text-sm font-medium"><Edit3 size={16} />Edit</button><button onClick={() => { if (window.confirm("Delete this task?")) { onDelete(task); onClose(); } }} className="flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-red-50 text-sm font-medium text-red-600"><Trash2 size={16} />Delete</button></div>
  </BottomSheet>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) { return <div className="flex items-center gap-3"><span className="rounded-xl bg-slate-100 p-2 text-slate-500">{icon}</span><div><p className="text-xs text-slate-400">{label}</p><div className="font-medium text-slate-700">{value}</div></div></div>; }
