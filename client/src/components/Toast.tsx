import { createContext, useContext, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastState {
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{ show: (message: string, type?: ToastType) => void } | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const show = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };
  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <div
          role="status"
          className="fixed z-50 bottom-5 left-1/2 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg flex gap-2"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="text-green-400 shrink-0" />
          ) : null}
          {toast.message}
          <button aria-label="Dismiss" onClick={() => setToast(null)} className="ml-auto">
            <X size={17} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}