import type { RefObject } from 'react';
import { wasteSamples } from '../data/wasteSamples';
import type { WasteAnalysis, WasteSample } from '../types';

interface ScannerPageProps {
  videoRef: RefObject<HTMLVideoElement>;
  image: string | null;
  analysis: WasteAnalysis | null;
  cameraActive: boolean;
  cameraError: string;
  analysisError: string;
  fileError: string;
  imageValidation: 'empty' | 'validating' | 'ready' | 'invalid';
  validationMessage: string;
  canUsePhotoForRequest: boolean;
  analyzing: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCapture: () => void;
  onImageFile: (file?: File) => void;
  onUsePhotoForRequest: () => void;
  onSelectSample: (sample: WasteSample) => void;
  onAnalyze: () => void;
  onCreateRequest: () => void;
}

export function ScannerPage(props: ScannerPageProps) {
  const { videoRef, image, analysis, cameraActive, cameraError, analysisError, fileError, imageValidation, validationMessage, canUsePhotoForRequest, analyzing, onStartCamera, onStopCamera, onCapture, onImageFile, onUsePhotoForRequest, onSelectSample, onAnalyze, onCreateRequest } = props;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Identificador de Residuos
          <span className="rounded-full border border-eco-200 bg-eco-100 px-2.5 py-0.5 text-xs font-bold text-eco-800">IA EcoCircular</span>
        </h1>
        <p className="mt-1 text-sm text-slate-600">Utiliza la cámara de tu móvil o sube una foto para clasificar el residuo y recibir recomendaciones.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              {cameraActive ? (
                <div className="relative h-full w-full">
                  <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                  <div className="pointer-events-none absolute inset-6 flex items-center justify-center rounded-lg border-2 border-dashed border-eco-300/80">
                    <span className="rounded bg-slate-900/80 px-2 py-1 text-xs text-eco-300">Centra un solo residuo y mantenlo enfocado</span>
                  </div>
                </div>
              ) : image ? (
                <img src={image} alt="Residuo seleccionado" className="h-full w-full object-cover" />
              ) : (
                <div className="space-y-3 p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-3xl text-slate-400">▣</div>
                <p className="max-w-xs text-xs text-slate-400">Coloca un residuo frente a la cámara o selecciona una fotografía para comenzar.</p>
                </div>
              )}
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-4 text-center text-xs text-rose-300">
                  <p className="mb-2 font-semibold">{cameraError}</p>
                  <button onClick={onStartCamera} className="rounded-lg border border-rose-700 bg-rose-900/50 px-3 py-1.5 text-white">Reintentar</button>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {cameraActive ? (
                <>
                  <button onClick={onCapture} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-eco-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-eco-700">● Tomar fotografía</button>
                  <button onClick={onStopCamera} className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-300">Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={onStartCamera} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2.5 text-xs font-medium text-white hover:bg-slate-900 sm:text-sm">▣ Abrir cámara</button>
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-eco-200 bg-eco-50 px-3 py-2.5 text-center text-xs font-medium text-eco-800 hover:bg-eco-100 sm:text-sm">
                    ↑ Subir archivo
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { onImageFile(event.target.files?.[0]); event.currentTarget.value = ''; }} />
                  </label>
                </>
              )}
            </div>

            {fileError && <p role="alert" className="mt-2 text-xs text-rose-700">{fileError}</p>}
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              <p className="mb-1 font-bold">Para una mejor fotografía</p>
              <ul className="ml-4 list-disc space-y-0.5">
                <li>Coloca un residuo centrado, visible y lo más completo posible.</li>
                <li>Usa buena iluminación, evita el movimiento y procura un fondo sencillo.</li>
                <li>El análisis solo describe lo que se alcanza a observar; no confirma composición química ni seguridad.</li>
              </ul>
            </div>
            {image && (
              <p role="status" className={`mt-2 rounded-lg border p-2 text-xs ${imageValidation === 'ready' ? 'border-eco-200 bg-eco-50 text-eco-900' : imageValidation === 'invalid' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
                {validationMessage}
              </p>
            )}
            {image && canUsePhotoForRequest && <button onClick={onUsePhotoForRequest} className="mt-3 w-full rounded-xl border border-eco-200 bg-eco-50 py-2.5 text-sm font-bold text-eco-800 hover:bg-eco-100">Usar fotografía en la solicitud</button>}
            {image && !cameraActive && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <button onClick={onAnalyze} disabled={analyzing || imageValidation !== 'ready'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-eco-600 to-emerald-600 py-3 text-sm font-bold text-white shadow-md transition hover:from-eco-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500">
                  {analyzing ? '◌ Enviando y analizando...' : analysisError ? '↻ Reintentar análisis' : '✓ Confirmar y Analizar Imagen'}
                </button>
              </div>
            )}
            {analysisError && <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-900">{analysisError}</p>}
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-100 p-3">
            <span className="mb-2 block text-[11px] font-bold uppercase text-slate-500">¿Sin cámara a mano? Prueba una muestra precargada:</span>
            <div className="grid grid-cols-3 gap-2">
              {wasteSamples.map((sample) => (
                <button key={sample.id} onClick={() => onSelectSample(sample)} className="group rounded-lg border border-slate-200 bg-white p-1.5 text-left transition hover:border-eco-500">
                  <img src={sample.imageUrl} alt={sample.name} className="mb-1 h-14 w-full rounded object-cover transition-transform group-hover:scale-[1.02]" />
                  <span className="block truncate text-[10px] font-semibold text-slate-700">{sample.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div>
          {analyzing ? (
            <section role="status" aria-live="polite" className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-eco-200 bg-white p-8 text-center shadow-sm">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-eco-100 border-t-eco-600" />
              <h2 className="text-lg font-bold text-slate-900">Analizando fotografía</h2>
              <p className="mt-2 max-w-xs text-sm text-slate-600">Enviando la imagen seleccionada. La inteligencia artificial examinará los objetos y materiales visibles.</p>
            </section>
          ) : analysis ? (
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <header className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="rounded border border-eco-200 bg-eco-50 px-2 py-0.5 text-xs font-extrabold uppercase text-eco-700">{statusLabel(analysis.status)}</span>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{analysis.object ?? 'Sin identificación'}</h2>
                </div>
              </header>

              {analysis.isDemo && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-900">
                  ⓘ <span><strong>Demostración académica:</strong> {analysis.demoNote ?? 'Datos simulados representativos.'}</span>
                </div>
              )}

              {analysis.status === 'uncertain' && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  Se detectó un objeto, pero no hay suficiente información visual para identificar su material con seguridad.
                </p>
              )}

              {analysis.items && analysis.items.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-800">{analysis.items.length > 1 ? 'Objetos distinguibles en la imagen' : 'Evidencia del objeto'}</h3>
                  {analysis.items.map((item, index) => (
                    <article key={`${item.object ?? 'objeto'}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                      <p className="font-bold text-slate-800">{item.object ?? 'Objeto visible'}{item.material ? ` — ${item.material}` : ' — material no determinado'}</p>
                      {item.evidence && <p className="mt-1 text-slate-600">Evidencia visible: {item.evidence}</p>}
                      {item.resinCode && <p className="mt-1 text-slate-600">Código visible: {item.resinCode}</p>}
                      {item.visibleCondition && <p className="mt-1 text-slate-600">Estado observable: {item.visibleCondition}</p>}
                    </article>
                  ))}
                </div>
              )}

              {analysis.status === 'identified' || analysis.status === 'uncertain' ? (
                <>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Info label="Material" value={analysis.material ?? 'Sin material'} />
                    <Info label="Estado visible" value={analysis.visibleCondition ?? 'No disponible'} />
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    {analysis.explanation && <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-700">{analysis.explanation}</p>}
                    {analysis.recommendations.length > 0 && <Advice title="✅ Recomendaciones" list={analysis.recommendations} tone="eco" />}
                    {analysis.reuseIdeas.length > 0 && <Advice title="🔄 Ideas de reutilización" list={analysis.reuseIdeas} tone="slate" />}
                    {analysis.warnings.length > 0 && <Advice title="⚠️ Precauciones" list={analysis.warnings} tone="rose" />}
                    {analysis.resinCode && <Info label="Código de resina / SPI" value={analysis.resinCode} />}
                    {(analysis.preparation || analysis.reuse || analysis.precautions || analysis.environmentalImpact) && (
                      <>
                        {analysis.preparation && <Advice title="🧼 Preparación" text={analysis.preparation} tone="eco" />}
                        {analysis.reuse && <Advice title="🔁 Reutilización" text={analysis.reuse} tone="slate" />}
                        {analysis.precautions && <Advice title="🛡️ Precauciones" text={analysis.precautions} tone="rose" />}
                        {analysis.environmentalImpact && <Advice title="🌍 Impacto ambiental" text={analysis.environmentalImpact} tone="blue" />}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-3 text-xs leading-relaxed">
                  <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
                    {analysis.status === 'not_relevant' && 'No identificamos ningún residuo reciclable relevante. Intenta fotografiar un objeto relacionado con el reciclaje.'}
                    {analysis.status === 'poor_image' && 'La imagen tiene poca claridad o información visual insuficiente para identificar un residuo con fiabilidad.'}
                    {analysis.status === 'not_recyclable' && 'El objeto visible no corresponde a un residuo reciclable dentro de la clasificación de esta aplicación.'}
                    {analysis.status === 'error' && 'No se pudo completar el análisis por un problema técnico o de conexión.'}
                  </p>
                  {analysis.explanation && <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-700">{analysis.explanation}</p>}
                  {analysis.recommendations.length > 0 && <Advice title="📌 Siguiente paso" list={analysis.recommendations} tone="eco" />}
                  {analysis.warnings.length > 0 && <Advice title="⚠️ Aviso" list={analysis.warnings} tone="rose" />}
                  {(analysis.status === 'poor_image' || analysis.status === 'error') && (
                    <button onClick={onAnalyze} disabled={imageValidation !== 'ready'} className="rounded-lg border border-eco-200 bg-eco-50 px-3 py-2 font-bold text-eco-800 hover:bg-eco-100 disabled:opacity-50">
                      Reintentar análisis
                    </button>
                  )}
                </div>
              )}

              {analysis.status === 'identified' && analysis.recyclable !== false && (
                <button onClick={onCreateRequest} className="flex w-full items-center justify-center gap-2 rounded-xl bg-eco-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-eco-700">
                  Entregar este residuo a una agencia →
                </button>
              )}
            </section>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">◌</div>
              <p className="max-w-xs text-sm font-medium text-slate-500">Aún no hay análisis. Toma una fotografía o sube una imagen para identificar residuos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5"><span className="block font-medium text-slate-500">{label}:</span><span className="font-bold text-slate-800">{value}</span></div>;
}

function statusLabel(status: WasteAnalysis['status']): string {
  const labels: Record<WasteAnalysis['status'], string> = {
    identified: 'Identificado',
    uncertain: 'Identificación incierta',
    not_recyclable: 'No reciclable',
    not_relevant: 'Imagen no relevante',
    poor_image: 'Imagen insuficiente',
    error: 'Error técnico',
  };
  return labels[status];
}

function Advice({ title, text, list, tone }: { title: string; text?: string; list?: string[]; tone: 'eco' | 'slate' | 'rose' | 'blue' }) {
  const colors = { eco: 'border-eco-100 bg-eco-50/60 text-eco-900', slate: 'border-slate-200 bg-slate-50 text-slate-800', rose: 'border-rose-100 bg-rose-50/70 text-rose-900', blue: 'border-blue-100 bg-blue-50/60 text-blue-900' };
  return <div className={`rounded-xl border p-3 ${colors[tone]}`}>
    <h3 className="mb-1 flex items-center gap-1.5 font-bold">{title}</h3>
    {list ? <ul className="ml-4 list-disc space-y-1 text-sm text-slate-700">{list.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="text-slate-700">{text}</p>}
  </div>;
}
