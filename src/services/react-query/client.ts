import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { openDB } from 'idb';

const checkInternetConnectivity = async () => {
  try {
    const response = await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
    return response.ok || navigator.onLine;
  } catch {
    return false;
  }
};

const getStaleTime = (isOnline: boolean) => (isOnline ? 1 : Infinity);

const createQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: getStaleTime(navigator.onLine),
        gcTime: Infinity,
      },
    },
  });

  const updateStaleTime = async () => {
    const isOnline = await checkInternetConnectivity();
    queryClient.setDefaultOptions({
      queries: {
        staleTime: getStaleTime(isOnline),
        gcTime: Infinity,
      },
    });
  };

  window.addEventListener('online', updateStaleTime);
  window.addEventListener('offline', updateStaleTime);

  return queryClient;
};

// ✅ Use IndexedDB for storage (better compatibility with Safari)
const idbPersister = async () => {
  const db = await openDB('query-cache', 1, {
    upgrade(db) {
      db.createObjectStore('persistedQueries');
    },
  });

  return createAsyncStoragePersister({
    storage: {
      getItem: async (key: IDBKeyRange | IDBValidKey) => (await db.get('persistedQueries', key)) ?? null,
      setItem: async (key: IDBKeyRange | IDBValidKey | undefined, value: any) => db.put('persistedQueries', value, key),
      removeItem: async (key: IDBKeyRange | IDBValidKey) => db.delete('persistedQueries', key),
    },
  });
};

export const queryClient = createQueryClient();
export const persister = await idbPersister();