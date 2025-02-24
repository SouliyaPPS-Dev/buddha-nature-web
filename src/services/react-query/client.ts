import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

// ✅ Create a Query Client
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity, // Makes queries cache forever unless invalidated
      },
    },
  });
};

// 🎯 Use the improved storage method
export const persister = createSyncStoragePersister({
  storage, // Now properly detects storage support including Safari Private Mode
});

// 🎯 Initialize Query Client
export const queryClient = createQueryClient();

// 🎯 Automatically Persist React Query Cache
persistQueryClient({
  queryClient,
  persister,
});
