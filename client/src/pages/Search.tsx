import { ArrowLeft, Search as SearchIcon, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { tasksApi, Task } from '../api/tasks';
import TaskRow from '../components/TaskRow';
import TaskSheet from '../components/TaskSheet';
import { useToast } from '../components/Toast';
import { useConfirm } from '../hooks/useConfirm';

export default function Search() {
  const nav = useNavigate();
  const { show: showToast } = useToast();
  const { show } = useConfirm();
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [sheet, setSheet] = useState<Task | null>(null);
  const debouncedQuery = useDebounce(q, 300);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await tasksApi.search(query);
      setItems(res.data);
    } catch (e: any) {
      showToast(e.message || 'Search failed', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(debouncedQuery), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [debouncedQuery, runSearch]);

  const toggle = async (t: Task) => {
    const next = t.status === 'completed' ? 'in-progress' : 'completed';
    setItems((xs) => xs.map((a) => (a._id === t._id ? { ...a, status: next } : a)));
    try {
      await tasksApi.status(t._id, next);
    } catch {
      showToast('Could not update task', 'error');
    }
  };

  const del = async (t: Task) => {
    const confirmed = await show({
      title: 'Delete task?',
      message: '\u201C' + t.title + '\u201D will be removed permanently.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    if (!confirmed) return;
    try {
      await tasksApi.remove(t._id);
      setItems((xs) => xs.filter((a) => a._id !== t._id));
      showToast('Task deleted');
    } catch (e: any) {
      showToast(e.message || 'Delete failed', 'error');
    }
  };

  return (
    <main className='app-shell min-h-screen p-5'>
      <div className='flex items-center gap-2'>
        <button className='icon-button' onClick={() => nav(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div className='flex flex-1 items-center gap-2 rounded-xl bg-white px-3'>
          <SearchIcon size={18} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Search for a task'
            className='h-12 w-full outline-none'
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className='shrink-0 text-slate-400 hover:text-royal'
              aria-label='Clear search'
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <section className='mt-7'>
        {loading && [1, 2, 3].map((i) => <div className='skeleton mb-2 h-16' key={i} />)}
        {!loading && q && !items.length && (
          <p className='py-16 text-center text-sm text-slate-400'>No tasks found</p>
        )}
        <div className='space-y-2'>
          {items.map((t) => (
            <TaskRow
              key={t._id}
              task={t}
              onToggle={toggle}
              onEdit={(tt: Task) => { setSheet(tt); }}
              onDelete={del}
              onView={(tt: Task) => { setSheet(tt); }}
            />
          ))}
        </div>
      </section>

      {sheet && (
        <TaskSheet
          task={sheet}
          date={sheet.date}
          onClose={() => setSheet(null)}
          onSaved={(updated) => {
            setSheet(null);
            setItems((xs) => xs.map((a) => (a._id === updated._id ? updated : a)));
          }}
        />
      )}
    </main>
  );
}
