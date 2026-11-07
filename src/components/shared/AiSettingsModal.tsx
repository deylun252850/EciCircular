interface AiSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function AiSettingsModal({ open, onClose }: AiSettingsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="ai-settings-title">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 id="ai-settings-title" className="flex items-center gap-2 text-base font-bold text-slate-900">🤖 IA EcoCircular</h2>
          <button onClick={onClose} aria-label="Cerrar configuración" className="text-sm font-bold text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <p className="text-xs leading-relaxed text-slate-600">La aplicación analiza cada imagen con un servicio de IA seguro y no exige que el usuario configure claves ni herramientas técnicas.</p>
        <div className="rounded-lg border border-eco-200 bg-eco-50 p-3 text-[11px] text-eco-900">
          Si el servicio externo no está disponible, la aplicación conserva la experiencia con resultados de respaldo y mantiene el flujo de uso intacto.
        </div>
        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="rounded-xl bg-eco-600 px-4 py-2 text-xs font-bold text-white hover:bg-eco-700">Entendido</button>
        </div>
      </section>
    </div>
  );
}
