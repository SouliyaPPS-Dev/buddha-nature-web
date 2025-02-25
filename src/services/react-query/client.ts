import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import {
  persistQueryClient,
  persistQueryClientRestore,
  persistQueryClientSave,
} from '@tanstack/react-query-persist-client';

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

export const storage = getStorage();

// ✅ Create a React Query Client that prevents API calls when offline
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: Infinity,
      },
    },
  });
};

// 🎯 Persist Query Data with Correct Storage
export const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const queryClient = createQueryClient();

// 🎯 Persist Query Cache Data for Offline Use
persistQueryClient({ queryClient, persister });
persistQueryClientSave({ queryClient, persister });
persistQueryClientRestore({ queryClient, persister });
