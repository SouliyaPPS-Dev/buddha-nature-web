import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';

// Cache API responses for 1 day
const ONE_DAY = 24 * 60 * 60 * 1000;

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: ONE_DAY,
        networkMode: 'always', // Ensure the client doesn't throw errors when offline
      },
    },
  });
};

// Initialize query client
export const queryClient = createQueryClient();

// Persist data so it works offline
export const persister = createSyncStoragePersister({
  storage: window.localStorage,
});
