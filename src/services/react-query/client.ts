import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';

// Define a 1-day timeout in milliseconds
const ONE_DAY = 1000 * 60 * 60 * 24;

// Modify Client to initialize queryClient
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // No retries for queries by default
        staleTime: ONE_DAY,
        gcTime: ONE_DAY,
        networkMode: 'offlineFirst',
        throwOnError(error) {
          if (error instanceof Error) {
            console.log(error);
            return false;
          }
          return true;
        },
      },
      mutations: {
        onError: (error) => {
          if (error instanceof Error) {
            console.log(error);
          }
        },
      },
    },
  });
};

// Initialize query client with global error handler
export const queryClient = createQueryClient();

// Use appropriate persister based on platform
export const persister = createSyncStoragePersister({
  storage: window.localStorage,
});
