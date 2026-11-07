import { useEffect, useState } from 'react';
import { loadRequests, saveRequests } from '../services/storageService';
import type { RecyclingRequest } from '../types';

export function useRequests() {
  const [requests, setRequests] = useState<RecyclingRequest[]>([]);
  const [storageError, setStorageError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchRequests() {
      try {
        const data = await loadRequests();
        if (active) {
          setRequests(data);
          setStorageError(false);
          setHasLoaded(true);
        }
      } catch {
        if (active) {
          setStorageError(true);
          setHasLoaded(true);
        }
      }
    }

    void fetchRequests();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    void saveRequests(requests).then((ok) => {
      setStorageError(!ok);
    }).catch(() => {
      setStorageError(true);
    });
  }, [hasLoaded, requests]);

  return { requests, setRequests, storageError };
}
