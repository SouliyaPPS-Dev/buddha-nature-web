import { persister, queryClient } from '@/services/react-query/client';
import '@/styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RouterProvider } from '@tanstack/react-router';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './router';

function App() {
  return (
    <HelmetProvider>
      <NextUIProvider
        navigate={(path) => {
          return router.navigate({
            to: path,
          });
        }}
      >
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <RouterProvider router={router} />
          {/* Add React Query Devtools */}
          <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
      </NextUIProvider>
    </HelmetProvider>
  );
}

export default App;
