import type { View } from '../../types';

interface MobileNavigationProps {
  view: View;
  requestCount: number;
  onNavigate: (view: View) => void;
}

const links: { view: View; label: string; icon: string }[] = [
  { view: 'home', label: 'Inicio', icon: '⌂' },
  { view: 'scanner', label: 'Escanear', icon: '▣' },
  { view: 'agencies', label: 'Agencias', icon: '▤' },
  { view: 'guide', label: 'Guía', icon: '▧' },
  { view: 'requests', label: 'Historial', icon: '☷' },
];

export function MobileNavigation({ view, requestCount, onNavigate }: MobileNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white px-1 py-1 text-[11px] font-medium text-slate-600 md:hidden" aria-label="Navegación móvil">
      {links.map(({ view: target, label, icon }) => (
        <button key={target} onClick={() => onNavigate(target)} className={`flex min-w-0 flex-1 flex-col items-center p-2 ${view === target ? 'font-bold text-eco-700' : ''}`}>
          <span className="mb-0.5 text-xl leading-5">{icon}</span>
          <span>{target === 'requests' ? `${label} (${requestCount})` : label}</span>
        </button>
      ))}
    </nav>
  );
}
