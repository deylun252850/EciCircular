import type { View } from '../../types';

export function Footer({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900 py-10 text-xs text-slate-400">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-4">
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center gap-2 text-base font-bold text-white"><span className="text-eco-400">●</span> EcoCircular Bolivia</div>
          <p className="max-w-sm leading-relaxed">Prototipo funcional de economía circular y educación ambiental. Desarrollado con tecnología web moderna e inteligencia artificial multimodal para mitigar la contaminación urbana.</p>
          <p className="text-[10px]">© 2026 EcoCircular — Datos demostrativos para presentación técnica.</p>
        </div>
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-white">Secciones</h2>
          <ul className="space-y-1.5">
            <li><button onClick={() => onNavigate('home')} className="hover:text-eco-400">Página Principal</button></li>
            <li><button onClick={() => onNavigate('scanner')} className="hover:text-eco-400">Identificador con Cámara</button></li>
            <li><button onClick={() => onNavigate('agencies')} className="hover:text-eco-400">Directorio de Agencias</button></li>
            <li><button onClick={() => onNavigate('guide')} className="hover:text-eco-400">Guía de Suelo, Agua y Aire</button></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-white">Valores y Compromiso</h2>
          <p className="leading-relaxed">Promovemos la dignificación de los recicladores de base y el cumplimiento de las metas de desarrollo sostenible en comunidades urbanas y rurales.</p>
        </div>
      </div>
    </footer>
  );
}
