import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';

// Define a 1-day timeout in milliseconds (optional, for finite caching)
// const ONE_DAY = 1000 * 60 * 60 * 24;

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // No retries on failure
        staleTime: Infinity, // Data never becomes stale
        gcTime: Infinity, // Cache never garbage collected
        networkMode: 'offlineFirst', // Prioritize cache, fetch only if no cache
        refetchOnWindowFocus: false, // Prevent refetch on tab focus
        refetchOnReconnect: false, // Prevent refetch on network reconnect
        refetchOnMount: false, // Prevent refetch when component mounts
        throwOnError(error) {
          if (error instanceof Error) {
            console.error('Query error:', error.message);
            return false; // Suppress error throwing
          }
          return true;
        },
      },
      mutations: {
        onError: (error) => {
          if (error instanceof Error) {
            console.error('Mutation error:', error.message);
          }
        },
      },
    },
  });
};

// Initialize query client
export const queryClient = createQueryClient();

// Create persister for localStorage
export const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// Debug cache state in development
if (process.env.NODE_ENV === 'development') {
  queryClient.getQueryCache().subscribe((event) => {
    console.log('Query cache event:', event);
  });
}
