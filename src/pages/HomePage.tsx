import type { View } from '../types';

export function HomePage({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden bg-gradient-to-b from-eco-900 via-eco-800 to-eco-950 px-4 pb-20 pt-12 text-white sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(#86efac_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
        <div className="relative z-10 mx-auto max-w-4xl space-y-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-eco-500/30 bg-eco-500/20 px-3 py-1 text-xs font-semibold text-eco-200"><span className="h-2 w-2 animate-ping rounded-full bg-eco-400" /> Iniciativa Ciudadana Bolivia 2026</span>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl md:text-6xl">Cada residuo cuenta.<br /><span className="bg-gradient-to-r from-eco-200 via-eco-400 to-emerald-300 bg-clip-text text-transparent">Tu acción transforma el planeta.</span></h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">EcoCircular te enseña a clasificar tus materiales en segundos con inteligencia artificial, conecta tus residuos con centros de reciclaje en Bolivia y previene la contaminación de nuestras aguas y suelos.</p>
          <div className="flex flex-col items-center justify-center gap-3 pt-3 sm:flex-row">
            <button onClick={() => onNavigate('scanner')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-eco-500 px-7 py-3.5 font-bold text-eco-950 shadow-lg shadow-eco-500/25 transition hover:bg-eco-400 active:scale-95 sm:w-auto">▣ Identificar un residuo ahora</button>
            <button onClick={() => onNavigate('agencies')} className="w-full rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 font-medium text-white transition hover:bg-white/20 sm:w-auto">Ver Agencias y Precios</button>
          </div>
          <p className="pt-2 font-mono text-xs text-eco-300/80">* Entorno interactivo para demostración académica. No compromete transacciones monetarias reales.</p>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-10 grid max-w-6xl grid-cols-2 gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl lg:grid-cols-4">
        {[
          ['1,480+', 'Kg recuperados', 'Datos demo', 'text-eco-700'],
          ['3,200 L', 'Agua preservada', 'Estimado', 'text-blue-600'],
          ['890 Kg', 'CO₂ mitigado', 'Cálculo ciclo vida', 'text-amber-600'],
          ['24', 'Puntos de acopio', 'Red piloto', 'text-emerald-700'],
        ].map(([value, label, note, color]) => <div key={label} className="p-3 text-center"><div className={`text-3xl font-extrabold sm:text-4xl ${color}`}>{value}</div><div className="mt-1 text-xs font-bold uppercase text-slate-600">{label}</div><span className="font-mono text-[10px] text-slate-500">({note})</span></div>)}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 space-y-2 text-center"><h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">¿Cómo funciona EcoCircular?</h2><p className="mx-auto max-w-xl text-sm text-slate-600">Un flujo circular diseñado para ser tan simple como tomar una foto con tu teléfono.</p></div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['1', 'Captura e Identifica', 'Toma una foto con tu cámara. La IA analiza el material, su código de reciclaje y su grado de limpieza.'],
            ['2', 'Prepara y Reutiliza', 'Aprende cómo enjuagar, secar y compactar el residuo según recomendaciones prácticas.'],
            ['3', 'Entrega o Monetiza', 'Explora las agencias demostrativas y genera una solicitud formal de entrega.'],
          ].map(([number, title, description]) => <article key={number} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-eco-300"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-eco-100 text-xl font-bold text-eco-800">{number}</div><h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3><p className="text-sm leading-relaxed text-slate-600">{description}</p></article>)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-eco-950 p-8 text-white shadow-2xl sm:p-12">
          <div className="mb-8 max-w-2xl space-y-4"><span className="font-mono text-xs font-semibold uppercase tracking-wider text-eco-400">Educación Crítica</span><h2 className="text-2xl font-extrabold sm:text-4xl">¿Qué ocurre cuando no reciclamos en nuestras ciudades?</h2><p className="text-sm leading-relaxed text-slate-300 sm:text-base">En muchas urbes de Bolivia, toneladas de residuos terminan en botaderos a cielo abierto o laderas, generando lixiviados y contaminación irreversible.</p></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['🌱', 'Contaminación del Suelo', 'Pilas, plásticos y aceites liberan metales pesados que degradan la tierra fértil e impiden la absorción de nutrientes.'],
              ['💧', 'Contaminación del Agua', 'Los ríos Choqueyapu, Rocha o Piraí arrastran plásticos que se degradan en micropartículas.'],
              ['💨', 'Contaminación del Aire', 'La quema indiscriminada de cables y basura libera sustancias peligrosas que afectan a las comunidades.'],
            ].map(([icon, title, description]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/10 p-5"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-xl">{icon}</div><h3 className="mb-1.5 font-bold">{title}</h3><p className="text-xs leading-relaxed text-slate-300">{description}</p></article>)}
          </div>
          <button onClick={() => onNavigate('guide')} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-eco-300 transition hover:text-white">Consultar la guía completa de prevención ecológica <span>→</span></button>
        </div>
      </section>
    </div>
  );
}
