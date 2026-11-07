import type { RecyclingRequest } from '../types';
import { apiUrl } from './api';

export async function loadRequests(): Promise<RecyclingRequest[]> {
  const response = await fetch(apiUrl('/api/requests'));
  if (!response.ok) {
    throw new Error('No se pudieron cargar las solicitudes del servidor.');
  }

  const payload = await response.json() as unknown;
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.filter(isRecyclingRequest);
}

export async function saveRequests(requests: RecyclingRequest[]): Promise<boolean> {
  const response = await fetch(apiUrl('/api/requests'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requests),
  });

  return response.ok;
}

function isRecyclingRequest(value: unknown): value is RecyclingRequest {
  if (!value || typeof value !== 'object') return false;
  const request = value as Partial<RecyclingRequest>;
  return ['id', 'date', 'material', 'quantityKg', 'agency', 'photoUrl', 'notes']
    .every((key) => typeof request[key as keyof RecyclingRequest] === 'string') &&
    (request.status === 'Pendiente' || request.status === 'Recibida' || request.status === 'Atendida');
}
