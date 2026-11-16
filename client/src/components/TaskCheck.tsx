import { Check } from "lucide-react";

export default function TaskCheck({ completed, onToggle }: { completed: boolean; onToggle: () => void }) {
  return <button type="button" aria-label={completed ? "Mark in progress" : "Mark complete"} aria-pressed={completed} onClick={(event) => { event.stopPropagation(); onToggle(); }} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${completed ? "border-royal bg-royal text-white" : "border-slate-300 bg-white"}`}>{completed && <Check size={16} strokeWidth={3} />}</button>;
}
