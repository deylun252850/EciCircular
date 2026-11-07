import { useMemo, useState } from 'react';
import { agencies, cities, materials } from '../data/agencies';
import type { Agency } from '../types';

export function AgenciesPage({ onSelectAgency }: { onSelectAgency: (agency: Agency) => void }) {
  const [city, setCity] = useState('Todas');
  const [material, setMaterial] = useState('Todos');
  const [search, setSearch] = useState('');
  const visibleAgencies = useMemo(() => agencies.filter((agency) =>
    (city === 'Todas' || agency.city === city) &&
    (material === 'Todos' || agency.materials.includes(material)) &&
    [agency.name, agency.zone, agency.address].some((text) => text.toLowerCase().includes(search.toLowerCase())),
  ), [city, material, search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Directorio de Agencias Recicladoras</h1><p className="text-sm text-slate-600">Centros de acopio demostrativos para compra y recepción de reciclables en Bolivia.</p></div><p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900">ℹ Datos, contactos y precios ficticios. Verifica cualquier información antes de acudir.</p></div>
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
          <label className="text-xs font-bold uppercase text-slate-600">Buscar por nombre o zona<input type="search" placeholder="Ej. Sopocachi, Illimani..." value={search} onChange={(event) => setSearch(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal normal-case text-slate-800 focus:outline-none focus:ring-2 focus:ring-eco-500" /></label>
          <label className="text-xs font-bold uppercase text-slate-600">Filtrar por ciudad<select value={city} onChange={(event) => setCity(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal normal-case text-slate-800 focus:outline-none focus:ring-2 focus:ring-eco-500"><option>Todas</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="text-xs font-bold uppercase text-slate-600">Tipo de material<select value={material} onChange={(event) => setMaterial(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal normal-case text-slate-800 focus:outline-none focus:ring-2 focus:ring-eco-500"><option>Todos</option>{materials.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
      </div>
      {visibleAgencies.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No hay agencias para esos filtros.</p> : <div className="grid gap-5 md:grid-cols-2">{visibleAgencies.map((agency) => <article key={agency.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-eco-300"><div>
        <div className="mb-2 flex items-start justify-between gap-2"><div><h2 className="font-bold text-slate-900">{agency.name} <span className="text-[10px] font-medium text-amber-700">(demo)</span></h2><p className="mt-0.5 text-xs text-slate-500">📍 {agency.city} — {agency.zone}</p></div><span className="whitespace-nowrap rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">Mínimo: {agency.minimumKg} kg</span></div>
        <p className="mb-3 text-xs text-slate-600">{agency.address}</p>
        <div className="mb-3"><span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Acepta según datos demostrativos:</span><div className="flex flex-wrap gap-1.5">{agency.materials.map((item) => <span key={item} className="rounded border border-eco-200 bg-eco-50 px-2 py-0.5 text-xs font-medium text-eco-900">{item}</span>)}</div></div>
        <div className="mb-3 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs"><span className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Precios demostrativos no verificados:</span><div className="grid grid-cols-2 gap-1 text-slate-700">{Object.entries(agency.referencePrices).map(([name, price]) => <div key={name} className="flex justify-between border-b border-slate-200/50 pb-0.5"><span className="truncate pr-1 text-slate-600">{name}:</span><span className="font-bold text-eco-800">{price}</span></div>)}</div></div>
        <div className="mb-4 space-y-1 text-[11px] text-slate-500"><p><strong>🕒 Horario:</strong> {agency.schedule}</p><p><strong>🚚 Modalidad:</strong> {agency.serviceType}</p></div>
      </div><div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3"><a href={`https://wa.me/${agency.whatsapp}?text=${encodeURIComponent(`Hola ${agency.name}, vi su perfil de demostración en EcoCircular y tengo material reciclable para entregar.`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-xs font-bold text-emerald-800 transition hover:bg-emerald-100">💬 WhatsApp (demo)</a><a href={`tel:${agency.phone.replace(/\s/g, '')}`} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Llamar</a><button onClick={() => onSelectAgency(agency)} className="flex-1 rounded-xl bg-eco-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-eco-700">Enviar Solicitud</button></div></article>)}</div>}
    </div>
  );
}
