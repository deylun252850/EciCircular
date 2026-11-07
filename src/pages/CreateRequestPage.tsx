import { useState, type FormEvent } from 'react';
import { agencies } from '../data/agencies';
import { readImageFile } from '../services/imageService';
import type { RequestFormValues } from '../types';

interface CreateRequestPageProps {
  initialValues: RequestFormValues;
  onSubmit: (values: RequestFormValues) => void;
  onBack: () => void;
  onGoToScanner: (values: RequestFormValues) => void;
}

export function CreateRequestPage({ initialValues, onSubmit, onBack, onGoToScanner }: CreateRequestPageProps) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  const update = (field: keyof RequestFormValues, value: string) => setValues((current) => ({ ...current, [field]: value }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quantity = Number(values.quantityKg);
    if (!Number.isFinite(quantity) || quantity < 0.5) {
      setError('Ingresa una cantidad válida de al menos 0.5 kg.');
      return;
    }
    onSubmit({ ...values, material: values.material.trim(), quantityKg: String(quantity) });
  };

  const uploadPhoto = async (file?: File) => {
    if (!file) return;
    try {
      update('photoUrl', await readImageFile(file));
      setError('');
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'No se pudo leer la imagen.');
    }
  };

  return <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <header className="mb-6 border-b border-slate-100 pb-4"><button onClick={onBack} className="mb-2 flex items-center gap-1 text-xs font-semibold text-eco-700 hover:text-eco-800">← Volver al directorio</button><h1 className="text-2xl font-extrabold text-slate-900">Crear Solicitud de Reciclaje</h1><p className="mt-1 text-xs text-slate-500">Registra tu entrega para recibir comprobante digital y coordinar con el centro de reciclaje.</p></header>
    <form onSubmit={submit} className="space-y-4 text-xs">
      <label className="block font-bold uppercase text-slate-700">Material o Residuo<input required maxLength={120} value={values.material} onChange={(event) => update('material', event.target.value)} placeholder="Ej. Plástico (PET) botellas aplastadas" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal normal-case text-slate-800 focus:outline-none focus:ring-2 focus:ring-eco-500" /></label>
      <label className="block font-bold uppercase text-slate-700">Agencia Recicladora de Destino<select required value={values.agencyId} onChange={(event) => update('agencyId', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal normal-case text-slate-800 focus:outline-none focus:ring-2 focus:ring-eco-500">{agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.name} — {agency.city} ({agency.zone}) · demo</option>)}</select></label>
      <label className="block font-bold uppercase text-slate-700">Cantidad Estimada (Kilogramos)<input type="number" min="0.5" max="100000" step="0.5" required value={values.quantityKg} onChange={(event) => update('quantityKg', event.target.value)} placeholder="Ej. 6.5" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal normal-case text-slate-800 focus:outline-none focus:ring-2 focus:ring-eco-500" /><span className="mt-1 block text-[10px] font-normal normal-case text-slate-400">Si no dispones de balanza, calcula: una bolsa grande de botellas aplastadas ≈ 2 a 3 kg.</span></label>
      <div><span className="block font-bold uppercase text-slate-700">Fotografía del residuo (Comprobante visual)</span>{values.photoUrl ? <div className="relative mt-1 aspect-video w-full overflow-hidden rounded-xl border border-slate-200"><img src={values.photoUrl} alt="Comprobante visual del residuo" className="h-full w-full object-cover" /><button type="button" onClick={() => update('photoUrl', '')} className="absolute right-2 top-2 rounded-md bg-rose-600 px-2 py-1 text-[10px] font-bold text-white">Cambiar foto</button></div> : <div className="mt-1 flex gap-2"><button type="button" onClick={() => onGoToScanner(values)} className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 font-medium text-slate-700 hover:bg-slate-200">▣ Tomar desde escáner</button><label className="flex-1 cursor-pointer rounded-lg border border-eco-200 bg-eco-50 px-3 py-2.5 text-center font-medium text-eco-800 hover:bg-eco-100">↑ Subir imagen<input type="file" accept="image/*" className="sr-only" onChange={(event) => void uploadPhoto(event.target.files?.[0])} /></label></div>}</div>
      <label className="block font-bold uppercase text-slate-700">Observaciones o Dirección de Recojo<textarea rows={3} maxLength={500} value={values.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Ej. Dejaré el material el día sábado por la mañana. Todo limpio y amarrado." className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-normal normal-case text-slate-800 focus:outline-none focus:ring-2 focus:ring-eco-500" /></label>
      <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600"><strong>Aviso de demostración:</strong> el registro se guardará en la memoria local de tu navegador. No se realizarán llamadas a empresas.</p>
      {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-800">{error}</p>}
      <button type="submit" className="mt-2 w-full rounded-xl bg-eco-600 px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-eco-700">Generar y Confirmar Solicitud</button>
    </form>
  </section></div>;
}
