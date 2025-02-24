import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

// 🔹 Check if `localStorage` is available (Fixes Safari Private Mode blocking)
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// 🔹 Choose storage: Use `localStorage` or fallback to `sessionStorage`
const storage = isLocalStorageAvailable()
  ? window.localStorage
  : window.sessionStorage;

// 🔥 Setup React Query & Storage Persistence
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1, // Retry once if API fails
        staleTime: Infinity, // Prevent refetching
      },
    },
  });
};

// Initialize QueryClient
export const queryClient = createQueryClient();

// 🔹 Persist Cached Data in Storage
export const persister = createSyncStoragePersister({ storage });

// 🔹 Persist React Query Cache on Load
persistQueryClient({
  queryClient,
  persister,
});
