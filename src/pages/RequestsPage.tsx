import type { RecyclingRequest } from '../types';

interface RequestsPageProps {
  requests: RecyclingRequest[];
  storageError: boolean;
  onNewRequest: () => void;
  onViewReceipt: (request: RecyclingRequest) => void;
}

export function RequestsPage({ requests, storageError, onNewRequest, onViewReceipt }: RequestsPageProps) {
  return <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-2"><div><h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Historial de Solicitudes</h1><p className="text-sm text-slate-600">Registro de entregas programadas durante la sesión del prototipo.</p></div><button onClick={onNewRequest} className="rounded-xl bg-eco-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-eco-700">+ Nueva Entrega</button></header>
    {storageError && <p role="status" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">No se pudo guardar en este navegador. Comprueba el espacio disponible o la configuración de almacenamiento.</p>}
    {requests.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">No tienes solicitudes registradas aún.</div> : <div className="space-y-3">{requests.map((request) => <article key={request.id} className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:p-5"><img src={request.photoUrl} alt={request.material} className="h-24 w-full flex-shrink-0 rounded-xl border border-slate-100 object-cover sm:w-24" /><div className="w-full flex-1 space-y-1 text-center sm:text-left"><div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between"><h2 className="text-sm font-extrabold text-slate-900">{request.material}</h2><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${request.status === 'Atendida' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : request.status === 'Recibida' ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>{request.status}</span></div><p className="text-xs text-slate-500">Destino: <strong className="text-slate-700">{request.agency}</strong></p><p className="text-xs text-slate-500">Cantidad: <strong className="text-eco-700">{request.quantityKg} Kg</strong> | Creado: {request.date}</p><p className="truncate text-[11px] italic text-slate-600">“{request.notes}”</p></div><button onClick={() => onViewReceipt(request)} className="w-full rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 sm:w-auto">Ver Voucher</button></article>)}</div>}
  </div>;
}
