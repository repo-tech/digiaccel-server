import { useEffect, useState } from "react";
import { Task } from "../api/tasks";
import TaskRow from "./TaskRow";

const LIMIT = 5;
interface Props { title: string; tasks: Task[]; loading: boolean; error?: string; onRetry: () => void; onToggle: (task: Task) => void; onEdit: (task: Task) => void; onDelete: (task: Task) => void; onView: (task: Task) => void; }
export default function TaskListSection({ title, tasks, loading, error, onRetry, onToggle, onEdit, onDelete, onView }: Props) {
  const [expanded, setExpanded] = useState(false); useEffect(() => setExpanded(false), [title]); useEffect(() => { if (tasks.length <= LIMIT) setExpanded(false); }, [tasks.length]);
  const visible = expanded ? tasks : tasks.slice(0, LIMIT);
  return <section className="mt-6 px-4" id="tasks-section"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">{title}{tasks.length > LIMIT ? ` (${tasks.length})` : ""}</h2>{tasks.length > LIMIT && !loading && <button className="text-xs font-medium text-royal" onClick={() => { if (expanded) document.getElementById("tasks-section")?.scrollIntoView({ behavior: "smooth" }); setExpanded(!expanded); }}>{expanded ? "Show Less" : "View All"}</button>}</div>{loading ? <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-16" />)}</div> : error ? <div className="py-4 text-center text-sm text-red-500">{error}<button onClick={onRetry} className="ml-2 text-royal">Retry</button></div> : tasks.length ? <div className={`grid transition-all duration-200 ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[1fr] opacity-100"}`}><div className="space-y-2">{visible.map((task) => <TaskRow key={task._id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} onView={onView} />)}</div></div> : <p className="py-4 text-center text-sm text-slate-400">No tasks for this day. Tap + to add one</p>}</section>;
}
