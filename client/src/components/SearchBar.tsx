import { Search as SearchIcon, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}

export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 shadow-soft">
      <SearchIcon size={18} className="shrink-0 text-slate-400" />
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a task"
        className="flex-1 min-h-12 outline-none placeholder-slate-400"
      />
      {value && (
        <button
          onClick={onClear}
          className="shrink-0 text-slate-400 hover:text-royal"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
