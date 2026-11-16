interface WeekProgressProps {
  percent: number;
}

export default function WeekProgress({ percent }: WeekProgressProps) {
  return (
    <section className="mt-6 px-4">
      <div className="flex justify-between mb-1.5 text-xs font-semibold text-slate-600">
        <span>Weekly Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-track">
        <div
          className="h-3 rounded-full bg-navy transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">Completed tasks ÷ total tasks this week</p>
    </section>
  );
}