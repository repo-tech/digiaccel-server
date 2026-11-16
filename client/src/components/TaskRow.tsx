import { Edit3, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Task } from "../api/tasks";
import TaskCheck from "./TaskCheck";

interface Props { task: Task; onToggle: (task: Task) => void; onEdit: (task: Task) => void; onDelete: (task: Task) => void; onView: (task: Task) => void; }
export default function TaskRow({ task, onToggle, onEdit, onDelete, onView }: Props) {
  const startX = useRef(0); const [translateX, setTranslateX] = useState(0); const metaText = [task.startTime, task.priority].filter(Boolean).join(" \u00B7 ");
  const end = (x: number) => setTranslateX(startX.current - x > 55 ? -96 : 0); const reset = () => setTranslateX(0);
  return <div className="relative overflow-hidden rounded-xl">{translateX < 0 && <button onClick={() => { onDelete(task); reset(); }} className="absolute inset-y-0 right-0 flex w-24 items-center justify-center gap-1 bg-red-500 text-xs font-medium text-white"><Trash2 size={16} />Delete</button>}<div onTouchStart={(e) => { startX.current = e.touches[0].clientX; }} onTouchEnd={(e) => end(e.changedTouches[0].clientX)} onMouseDown={(e) => { startX.current = e.clientX; }} onMouseUp={(e) => end(e.clientX)} onMouseLeave={reset} style={{ transform: `translateX(${translateX}px)` }} className="relative flex min-h-[64px] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 transition-transform duration-200"><TaskCheck completed={task.status === "completed"} onToggle={() => onToggle(task)} /><button onClick={() => onView(task)} className="min-w-0 flex-1 p-2 text-left"><p className={`truncate text-sm font-medium ${task.status === "completed" ? "text-slate-400 line-through" : ""}`}>{task.title}</p><p className="text-xs text-slate-400">{metaText}</p></button><button className="icon-button h-9 w-9" aria-label="Edit task" onClick={(e) => { e.stopPropagation(); onEdit(task); }}><Edit3 size={17} /></button><button className="icon-button hidden h-9 w-9 sm:inline-flex" aria-label="Delete task" onClick={(e) => { e.stopPropagation(); onDelete(task); }}><Trash2 size={17} /></button></div></div>;
}
