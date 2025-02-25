import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryCache } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

// 🔹 Offline-safe storage (Handles Safari Private Mode)
const getStorage = () => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    try {
      return window.sessionStorage;
    } catch (e) {
      console.warn('⚠️ No Web Storage Available - Using In-Memory Cache');
      let memoryStorage: Record<string, string> = {};
      return {
        setItem: (key: string, value: string) => {
          memoryStorage[key] = value;
        },
        getItem: (key: string) => memoryStorage[key] || null,
        removeItem: (key: string) => {
          delete memoryStorage[key];
        },
      };
    }
  }
};

const storage = getStorage();

// ✅ Create a React Query Client that prevents API calls when offline
const createQueryClient = () => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        console.error('React Query Error:', error);
      },
    }),
    defaultOptions: {
      queries: {
        retry: 1, // Retry once if an error occurs
        staleTime: 5 * 60 * 1000, // 5 minutes (Keeps data fresh)
        refetchOnMount: () => navigator.onLine, // ✅ Only refetch when online
        refetchOnReconnect: true, // ✅ Refetch when back online
        refetchOnWindowFocus: () => navigator.onLine, // ✅ Avoid refetching if offline
        networkMode: 'online', // 🛑 Block queries if offline
      },
    },
  });
};

// 🎯 Persist Query Data with Correct Storage
export const persister = createSyncStoragePersister({
  storage,
});

export const queryClient = createQueryClient();

// 🎯 Persist Query Cache Data for Offline Use
persistQueryClient({
  queryClient,
  persister,
});
