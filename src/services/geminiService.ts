import type { WasteAnalysis } from '../types';
import { apiUrl } from './api';

export class AnalysisRequestError extends Error {
  constructor(message: string, readonly code?: string) {
    super(message);
    this.name = 'AnalysisRequestError';
  }
}

export async function analyzeWithGemini(imageDataUrl: string, signal: AbortSignal): Promise<WasteAnalysis> {
  let response: Response;
  try {
    response = await fetch(apiUrl('/api/analyze-image'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageDataUrl }),
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new AnalysisRequestError('No se pudo conectar con el servidor. Comprueba que EcoCircular esté ejecutándose y vuelve a intentarlo.', 'CONNECTION_ERROR');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new AnalysisRequestError('El servidor devolvió una respuesta que no se pudo interpretar. Intenta nuevamente.', 'INVALID_RESPONSE');
  }

  if (!payload || typeof payload !== 'object') {
    throw new AnalysisRequestError('El servidor devolvió una respuesta inválida. Intenta nuevamente.', 'INVALID_RESPONSE');
  }
  const data = payload as Partial<WasteAnalysis> & { code?: string; message?: string };
  if (!response.ok) {
    throw new AnalysisRequestError(data.message || 'No se pudo completar el análisis.', data.code);
  }

  const statuses = ['identified', 'uncertain', 'not_recyclable', 'not_relevant', 'poor_image', 'error'];
  if (!statuses.includes(data.status ?? '') || typeof data.recyclable !== 'boolean') {
    throw new AnalysisRequestError('El resultado del análisis no tiene el formato esperado. Puedes volver a intentarlo.', 'INVALID_RESPONSE');
  }

  const items = Array.isArray(data.items)
    ? data.items
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        object: typeof item.object === 'string' ? item.object : null,
        material: typeof item.material === 'string' ? item.material : null,
        evidence: typeof item.evidence === 'string' ? item.evidence : null,
        resinCode: typeof item.resinCode === 'string' ? item.resinCode : null,
        visibleCondition: typeof item.visibleCondition === 'string' ? item.visibleCondition : null,
        recyclable: item.recyclable === true,
      }))
      .filter((item) => item.object || item.material)
    : [];

  return {
    status: data.status!,
    items,
    object: typeof data.object === 'string' ? data.object : null,
    material: typeof data.material === 'string' ? data.material : null,
    specific: typeof data.specific === 'string' ? data.specific : null,
    resinCode: typeof data.resinCode === 'string' ? data.resinCode : null,
    visibleCondition: typeof data.visibleCondition === 'string' ? data.visibleCondition : null,
    confidence: typeof data.confidence === 'string' ? data.confidence : null,
    recyclable: data.recyclable,
    explanation: typeof data.explanation === 'string' ? data.explanation : '',
    recommendations: Array.isArray(data.recommendations) ? data.recommendations.filter((item): item is string => typeof item === 'string') : [],
    reuseIdeas: Array.isArray(data.reuseIdeas) ? data.reuseIdeas.filter((item): item is string => typeof item === 'string') : [],
    warnings: Array.isArray(data.warnings) ? data.warnings.filter((item): item is string => typeof item === 'string') : [],
  };
}
