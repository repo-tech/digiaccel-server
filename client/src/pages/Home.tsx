import { addWeeks, format, isToday, startOfWeek } from "date-fns";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Task, TaskFormInput, WeekCard as Week } from "../api/tasks";
import SearchBar from "../components/SearchBar";
import SummaryCards from "../components/SummaryCards";
import TaskDetailsSheet from "../components/TaskDetailsSheet";
import TaskListSection from "../components/TaskListSection";
import TaskSheet from "../components/TaskSheet";
import WeekCard from "../components/WeekCard";
import WeekProgress from "../components/WeekProgress";
import WeekStrip from "../components/WeekStrip";
import { useToast } from "../components/Toast";
import { useDebounce } from "../hooks/useDebounce";
import { useTasksStore } from "../store/TasksProvider";
import { tasksApi } from "../api/tasks";

const iso = (date: Date) => format(date, "yyyy-MM-dd");
export default function Home() {
  const [day, setDay] = useState(() => new Date()); const [query, setQuery] = useState(""); const [weeks, setWeeks] = useState<Week[]>([]); const [searchResults, setSearchResults] = useState<Task[]>([]); const [detailsId, setDetailsId] = useState(""); const [sheetTask, setSheetTask] = useState<Task | null>(null); const { show } = useToast();
  const store = useTasksStore(); const date = iso(day); const week = iso(startOfWeek(day, { weekStartsOn: 1 })); const summary = store.summaryForWeek(week); const tasks = store.tasksForDate(date); const debounced = useDebounce(query, 300);
  useEffect(() => { store.loadWeek(week); }, [week]);
  useEffect(() => { tasksApi.weeks().then((res) => setWeeks(res.data)).catch(() => show("Failed to load weeks", "error")); }, []);
  useEffect(() => { let active = true; if (debounced.trim()) store.search(debounced).then((items) => { if (active) setSearchResults(items); }).catch(() => setSearchResults([])); else setSearchResults([]); return () => { active = false; }; }, [debounced]);
  const detailTask = Object.values(store.state.tasksById).find((task) => task._id === detailsId) || null;
  const add = () => setSheetTask({ _id: "", title: "", description: "", date, startTime: "09:00", endTime: "", priority: "Medium", status: "in-progress", createdAt: "", updatedAt: "" });
  const save = async (value: TaskFormInput) => { try { await store.saveTask(value, sheetTask?._id || undefined); setSheetTask(null); show("Task saved"); } catch { show("Could not save task", "error"); } };
  const del = async (task: Task) => { await store.deleteTask(task); setDetailsId(""); };
  const title = isToday(day) ? "Tasks Today" : `Tasks - ${format(day, "EEE, MMM d")}`;
  return <main className="app-shell pb-[calc(6rem+env(safe-area-inset-bottom))]"><header className="px-5 pt-7"><h1 className="text-2xl font-bold">My Tasks</h1><SearchBar value={query} onChange={setQuery} onClear={() => setQuery("")} /></header><WeekStrip selected={day} onSelect={setDay} onPrev={() => setDay(addWeeks(day, -1))} onNext={() => setDay(addWeeks(day, 1))} /><SummaryCards completed={summary.completed} pending={summary.pending} /><WeekProgress percent={summary.percent} />
    {!query.trim() && <section className="mt-6 px-4"><h2 className="mb-3 text-sm font-semibold">Weeks</h2>{weeks.map((item) => <WeekCard key={item.weekStart} week={item} selected={date >= item.weekStart && date <= item.weekEnd} tasks={store.tasksForWeek(item.weekStart)} loaded={Boolean(store.state.loadedWeeks[item.weekStart])} loading={Boolean(store.state.loadingWeeks[item.weekStart])} onLoad={() => store.loadWeek(item.weekStart)} onToggle={store.toggleStatus} onEdit={setSheetTask} onDelete={del} onView={(task) => setDetailsId(task._id)} />)}</section>}
    <TaskListSection title={query.trim() ? "Search results" : title} tasks={query.trim() ? searchResults : tasks} loading={!store.state.loadedWeeks[week] && Boolean(store.state.loadingWeeks[week])} error={store.state.error} onRetry={() => store.loadWeek(week)} onToggle={store.toggleStatus} onEdit={setSheetTask} onDelete={del} onView={(task) => setDetailsId(task._id)} />
    {sheetTask && <TaskSheet task={sheetTask} date={date} onClose={() => setSheetTask(null)} onSaved={save} />}{detailTask && <TaskDetailsSheet task={detailTask} onClose={() => setDetailsId("")} onToggle={store.toggleStatus} onEdit={setSheetTask} onDelete={del} />}<button onClick={add} className="fixed bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-royal text-white shadow-soft" aria-label="Add new task"><Plus size={22} /></button></main>;
}
