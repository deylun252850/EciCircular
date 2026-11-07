import type { View } from '../../types';

interface HeaderProps {
  view: View;
  requestCount: number;
  onNavigate: (view: View) => void;
}

const links: { view: View; label: string }[] = [
  { view: 'home', label: 'Inicio' },
  { view: 'scanner', label: 'Identificar Residuo' },
  { view: 'agencies', label: 'Agencias' },
  { view: 'guide', label: 'Guía Ecológica' },
  { view: 'requests', label: 'Solicitudes' },
];

export function Header({ view, requestCount, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => onNavigate('home')} className="group flex items-center gap-2.5 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-eco-800 to-eco-600 text-xl text-white shadow-sm transition-transform group-hover:scale-105">♻</span>
          <span>
            <span className="flex items-center gap-1 font-extrabold text-xl text-eco-950">Eco<span className="text-eco-600">Circular</span><span className="ml-1 rounded border border-eco-200 bg-eco-100 px-1.5 py-0.5 text-[10px] uppercase text-eco-800">BO</span></span>
            <span className="block text-[11px] font-medium leading-none text-slate-500">Gestión & Educación Ambiental</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex" aria-label="Navegación principal">
          {links.map(({ view: target, label }) => (
            <button key={target} onClick={() => onNavigate(target)} className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-colors ${view === target ? 'bg-eco-50 font-semibold text-eco-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              {target === 'scanner' && <span className="h-2 w-2 animate-pulse rounded-full bg-eco-500" />}
              {label}{target === 'requests' && <span className="rounded-full bg-slate-200 px-1.5 text-xs text-slate-700">{requestCount}</span>}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('scanner')} className="flex items-center gap-1.5 rounded-lg bg-eco-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-eco-700 sm:px-4"><span>▣</span><span>Identificar</span></button>
        </div>
      </div>
    </header>
  );
}
