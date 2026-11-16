import { CheckCircle2, CircleX } from 'lucide-react';
import type { ReactElement } from 'react';

interface SummaryCardProps {
  label: string;
  value: number;
  icon: ReactElement['type'];
  tone: 'blue' | 'pink';
}

function cardTone(tone: 'blue' | 'pink') {
  return tone === 'blue' ? 'bg-done border-blue-200' : 'bg-pending border-red-100';
}

function iconTone(tone: 'blue' | 'pink') {
  return tone === 'blue'
    ? 'p-2 rounded-lg bg-royal/20 border border-royal/30 text-royal'
    : 'p-2 rounded-lg bg-red-50 border border-red-100 text-red-500';
}

function SummaryCard({ label, value, icon: Icon, tone }: SummaryCardProps) {
  return (
    <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${cardTone(tone)}`}>
      <div className={iconTone(tone)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

interface SummaryCardsProps {
  completed: number;
  pending: number;
}

export default function SummaryCards({ completed, pending }: SummaryCardsProps) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <SummaryCard label="Task Complete This Week" value={completed} icon={CheckCircle2} tone="blue" />
      <SummaryCard label="Task Pending This Week" value={pending} icon={CircleX} tone="pink" />
    </div>
  );
}