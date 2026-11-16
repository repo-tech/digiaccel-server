import { addDays, format, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatWeekRange } from "../utils/date";

interface Props { selected: Date; onSelect: (date: Date) => void; onPrev: () => void; onNext: () => void; }
export default function WeekStrip({ selected, onSelect, onPrev, onNext }: Props) {
  const start = startOfWeek(selected, { weekStartsOn: 1 }); const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return <section className="mt-6 px-4"><div className="mb-2 flex items-center justify-between"><button onClick={onPrev} className="icon-button" aria-label="Previous week"><ChevronLeft size={18} /></button><span className="text-sm font-semibold text-slate-600">{formatWeekRange(start, addDays(start, 6))}</span><button onClick={onNext} className="icon-button" aria-label="Next week"><ChevronRight size={18} /></button></div><div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">{days.map((day) => { const active = format(day, "yyyy-MM-dd") === format(selected, "yyyy-MM-dd"); return <button key={format(day, "yyyy-MM-dd")} onClick={() => onSelect(day)} className={`flex w-14 flex-col items-center gap-1 rounded-lg border px-1 py-2 text-xs ${active ? "border-royal bg-royal text-white" : "border-slate-100 bg-white text-slate-500"}`}><span className="font-semibold">{format(day, "EEE")}</span><span className={active ? "h-1.5 w-1.5 rounded-full bg-white" : "h-1.5 w-1.5 rounded-full bg-slate-200"} /><span className="text-[10px]">{format(day, "d")}</span></button>; })}</div></section>;
}
