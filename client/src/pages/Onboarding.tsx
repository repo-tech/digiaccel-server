import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const nav = useNavigate();
  const begin = () => {
    localStorage.setItem('todo-onboarded', '1');
    nav('/home');
  };
  return (
    <main className="app-shell flex min-h-screen flex-col">
      <section className="relative h-[58vh] overflow-hidden bg-royal">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[35px] border-blue-300/30" />
        <svg className="absolute bottom-8 left-0 w-full opacity-30" height="70" viewBox="0 0 430 70">
          <path
            d="M0 50 L35 15 70 50 105 15 140 50 175 15 210 50 245 15 280 50 315 15 350 50 385 15 430 50"
            fill="none"
            stroke="white"
            strokeWidth={5}
          />
        </svg>
        <div className="absolute left-9 top-16 text-5xl font-bold tracking-tighter text-white">
          To·Do
        </div>
        <div className="absolute bottom-20 left-9 h-24 w-24 rounded-full bg-white/15" />
      </section>
      <section className="flex flex-1 flex-col p-7 pt-9">
        <h1 className="text-3xl font-bold leading-tight">
          Manage What<br /> To Do
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
          The best way to manage what you have to do, don't forget your plans.
        </p>
        <button
          onClick={begin}
          className="mt-auto flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-royal font-semibold text-white"
        >
          Get Started <ArrowRight size={19} />
        </button>
      </section>
    </main>
  );
}