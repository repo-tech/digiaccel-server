import { createContext, useContext, useMemo, useReducer } from "react";
import { Task, TaskFormInput, tasksApi } from "../api/tasks";
import { useToast } from "../components/Toast";

type State = { tasksById: Record<string, Task>; loadedWeeks: Record<string, true>; weeksMeta: any[]; loadingWeeks: Record<string, boolean>; error: string };
type Action = { type: "many"; tasks: Task[] } | { type: "one"; task: Task } | { type: "remove"; id: string } | { type: "loaded"; week: string } | { type: "meta"; weeks: any[] } | { type: "loading"; week: string; value: boolean } | { type: "error"; value: string };
const initial: State = { tasksById: {}, loadedWeeks: {}, weeksMeta: [], loadingWeeks: {}, error: "" };
function reducer(state: State, action: Action): State {
  if (action.type === "many") return { ...state, tasksById: { ...state.tasksById, ...Object.fromEntries(action.tasks.map((task) => [task._id, { ...task, date: String(task.date).slice(0, 10) }])) } };
  if (action.type === "one") return { ...state, tasksById: { ...state.tasksById, [action.task._id]: { ...action.task, date: String(action.task.date).slice(0, 10) } } };
  if (action.type === "remove") { const tasksById = { ...state.tasksById }; delete tasksById[action.id]; return { ...state, tasksById }; }
  if (action.type === "loaded") return { ...state, loadedWeeks: { ...state.loadedWeeks, [action.week]: true }, loadingWeeks: { ...state.loadingWeeks, [action.week]: false }, error: "" };
  if (action.type === "meta") return { ...state, weeksMeta: action.weeks };
  if (action.type === "loading") return { ...state, loadingWeeks: { ...state.loadingWeeks, [action.week]: action.value } };
  return { ...state, error: action.value };
}
type ContextValue = { state: State; tasksForDate: (date: string) => Task[]; tasksForWeek: (week: string) => Task[]; summaryForWeek: (week: string) => { completed: number; pending: number; total: number; percent: number }; loadWeek: (week: string) => Promise<void>; search: (query: string) => Promise<Task[]>; toggleStatus: (task: Task) => Promise<void>; saveTask: (task: TaskFormInput, id?: string) => Promise<Task>; deleteTask: (task: Task) => Promise<void> };
const Context = createContext<ContextValue | null>(null);
export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial); const { show } = useToast();
  const tasksForWeek = (week: string) => Object.values(state.tasksById).filter((task) => task.date >= week && task.date <= addDays(week, 6)).sort(sortTasks);
  const tasksForDate = (date: string) => Object.values(state.tasksById).filter((task) => task.date === date).sort(sortTasks);
  const summaryForWeek = (week: string) => { const tasks = tasksForWeek(week); const completed = tasks.filter((task) => task.status === "completed").length; return { completed, pending: tasks.length - completed, total: tasks.length, percent: tasks.length ? Math.round(completed * 100 / tasks.length) : 0 }; };
  const loadWeek = async (week: string) => { if (state.loadedWeeks[week] || state.loadingWeeks[week]) return; dispatch({ type: "loading", week, value: true }); try { const res = await tasksApi.list({ weekStart: week }); dispatch({ type: "many", tasks: res.data }); dispatch({ type: "loaded", week }); } catch { dispatch({ type: "error", value: "Failed to load tasks" }); dispatch({ type: "loading", week, value: false }); } };
  const refreshMeta = () => tasksApi.weeks().then((res) => dispatch({ type: "meta", weeks: res.data })).catch(() => {});
  const toggleStatus = async (task: Task) => { const old = task; const next = { ...task, status: task.status === "completed" ? "in-progress" as const : "completed" as const }; dispatch({ type: "one", task: next }); try { await tasksApi.status(task._id, next.status); refreshMeta(); } catch { dispatch({ type: "one", task: old }); show("Could not update task", "error"); } };
  const saveTask = async (data: TaskFormInput, id?: string) => { const result = id ? await tasksApi.update(id, data) : await tasksApi.create(data); dispatch({ type: "one", task: result.data }); refreshMeta(); return result.data; };
  const deleteTask = async (task: Task) => { dispatch({ type: "remove", id: task._id }); try { await tasksApi.remove(task._id); refreshMeta(); } catch { dispatch({ type: "one", task }); show("Delete failed", "error"); } };
  const search = async (query: string) => { if (!query.trim()) return []; const res = await tasksApi.search(query); dispatch({ type: "many", tasks: res.data }); return res.data as Task[]; };
  const value = useMemo(() => ({ state, tasksForDate, tasksForWeek, summaryForWeek, loadWeek, search, toggleStatus, saveTask, deleteTask }), [state]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useTasksStore() { const value = useContext(Context); if (!value) throw new Error("TasksProvider missing"); return value; }
function sortTasks(a: Task, b: Task) { return a.startTime.localeCompare(b.startTime) || a.createdAt.localeCompare(b.createdAt); }
function addDays(week: string, days: number) { const date = new Date(`${week}T00:00:00`); date.setDate(date.getDate() + days); return date.toISOString().slice(0, 10); }
