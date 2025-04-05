import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { openDB } from 'idb';

const checkInternetConnectivity = async () => {
  try {
    const response = await fetch('https://www.gstatic.com/generate_204', { method: 'HEAD' });
    return response.ok || navigator.onLine;
  } catch {
    return navigator.onLine;
  }
};

export const getStaleTime = (isOnline: boolean) => (isOnline ? 1 : Infinity);

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

// ✅ Check if IndexedDB is available
const isIndexedDBAvailable = () => {
  return !!(window.indexedDB && openDB);
};

// ✅ Dual Persister: IndexedDB (Primary) + localStorage (Fallback)
const createDualPersister = async () => {
  if (isIndexedDBAvailable()) {
    const db = await openDB('query-cache', 1, {
      upgrade(db) {
        db.createObjectStore('persistedQueries');
      },
    });

    return createAsyncStoragePersister({
      storage: {
        getItem: async (key: IDBKeyRange | IDBValidKey) => (await db.get('persistedQueries', key)) ?? null,
        setItem: async (key: IDBKeyRange | IDBValidKey | undefined, value: any) =>
          db.put('persistedQueries', value, key),
        removeItem: async (key: IDBKeyRange | IDBValidKey) => db.delete('persistedQueries', key),
      },
    });
  } else {
    console.warn('IndexedDB not available, falling back to localStorage.');
    return createAsyncStoragePersister({
      storage: window.localStorage,
    });
  }
};

export const queryClient = createQueryClient();
export const persisterPromise = createDualPersister(); // Returns a Promise

// ✅ Usage Example (inside an async function)
export const setupPersister = async () => {
  const persister = await persisterPromise;
  return persister;
};