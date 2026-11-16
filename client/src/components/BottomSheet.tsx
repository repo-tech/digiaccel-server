import { useEffect } from "react";

export default function BottomSheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => { const old = document.body.style.overflow; const esc = (event: KeyboardEvent) => event.key === "Escape" && onClose(); document.body.style.overflow = "hidden"; window.addEventListener("keydown", esc); return () => { document.body.style.overflow = old; window.removeEventListener("keydown", esc); }; }, [onClose]);
  return <div className="fixed inset-0 z-50 flex items-end bg-slate-900/40 md:items-center md:p-4"><button className="absolute inset-0" aria-label="Close sheet" onClick={onClose} /><section className="sheet-enter relative max-h-[90dvh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-xl md:mx-auto md:rounded-3xl"><div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />{children}</section></div>;
}
