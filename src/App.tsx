import { persister, queryClient } from '@/services/react-query/client';
import '@/styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RouterProvider } from '@tanstack/react-router';
import { HelmetProvider } from 'react-helmet-async';
import PageTransition from './components/PageTransition';
import { router } from './router';
import { ThemeProvider } from '@/hooks/use-theme';


function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <NextUIProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
          >
            {/* Wrapping only the page content inside the transition */}
            <PageTransition>
              <RouterProvider router={router} />
            </PageTransition>

            {/* Add React Query Devtools */}
            <ReactQueryDevtools initialIsOpen={false} />
          </PersistQueryClientProvider>
        </NextUIProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
