import type { RecyclingRequest } from '../types';

export function ReceiptPage({ request, onViewHistory }: { request: RecyclingRequest; onViewHistory: () => void }) {
  return <div className="mx-auto max-w-xl px-4 py-8 sm:px-6"><section className="receipt-print relative overflow-hidden rounded-3xl border-2 border-eco-200 bg-white p-6 shadow-xl sm:p-8">
    <div className="absolute right-0 top-0 translate-x-7 translate-y-3 rotate-45 bg-eco-500 px-8 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm">DEMO VÁLIDA</div>
    <header className="mb-6 space-y-1 text-center"><div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-eco-100 text-2xl font-bold text-eco-700">✓</div><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Comprobante de Gestión Circular</span><h1 className="text-xl font-extrabold text-slate-900">{request.id}</h1><p className="text-xs text-slate-500">{request.date} (Hora Bolivia)</p></header>
    <div className="mb-4 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"><img src={request.photoUrl} alt="Comprobante visual del residuo" className="h-full w-full object-cover" /></div>
    <dl className="mb-6 space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs"><Row label="Material registrado" value={request.material} /><Row label="Peso estimado" value={`${request.quantityKg} Kg`} highlight /><Row label="Agencia receptora" value={request.agency} /><div className="flex justify-between border-b border-slate-200/60 pb-1.5"><dt className="text-slate-500">Estado de solicitud:</dt><dd className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 font-bold text-amber-600">{request.status}</dd></div><div className="pt-1"><dt className="mb-0.5 text-slate-500">Notas del usuario:</dt><dd className="rounded border border-slate-200 bg-white p-2 italic text-slate-700">“{request.notes}”</dd></div></dl>
    <div className="flex flex-col gap-2 sm:flex-row"><button onClick={onViewHistory} className="flex-1 rounded-xl bg-eco-600 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-eco-700">Ver en Mi Historial</button><button onClick={() => window.print()} className="rounded-xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200">Imprimir / Guardar PDF</button></div>
  </section></div>;
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className="flex justify-between gap-4 border-b border-slate-200/60 pb-1.5"><dt className="text-slate-500">{label}:</dt><dd className={`text-right font-bold ${highlight ? 'text-eco-700' : 'text-slate-900'}`}>{value}</dd></div>;
}
