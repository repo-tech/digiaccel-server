import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Task, WeekCard as Week } from "../api/tasks";
import { formatTaskCount, formatWeekRange } from "../utils/date";
import TaskRow from "./TaskRow";

interface Props { week: Week; selected: boolean; tasks: Task[]; loaded: boolean; loading: boolean; onLoad: () => void; onToggle: (task: Task) => void; onEdit: (task: Task) => void; onDelete: (task: Task) => void; onView: (task: Task) => void; }
export default function WeekCard({ week, selected, tasks, loaded, loading, onLoad, onToggle, onEdit, onDelete, onView }: Props) {
  const [open, setOpen] = useState(false); const toggle = () => { if (!loaded) onLoad(); setOpen((value) => !value); };
  return <div className={`mb-3 rounded-xl border bg-white px-4 py-3 ${selected ? "border-royal/40" : "border-slate-200"}`}><button onClick={toggle} className="flex w-full items-center justify-between"><div className="text-left"><p className="text-sm font-semibold">{formatWeekRange(new Date(`${week.weekStart}T00:00:00`), new Date(`${week.weekEnd}T00:00:00`))}</p><p className="text-xs text-slate-500">{formatTaskCount(loaded ? tasks.length : week.total)} {selected && <span className="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">Selected</span>}</p></div><ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} /></button><div className={`grid transition-all duration-200 ${open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="min-h-0 space-y-2 overflow-hidden">{loading ? [1, 2, 3].map((i) => <div key={i} className="skeleton h-16" />) : tasks.length ? tasks.map((task) => <TaskRow key={task._id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} onView={onView} />) : <p className="py-2 text-center text-xs text-slate-400">No tasks this week</p>}</div></div></div>;
}
