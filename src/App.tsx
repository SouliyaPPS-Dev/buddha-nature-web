import { ThemeProvider } from '@/hooks/use-theme';
import { persisterPromise, queryClient } from '@/services/react-query/client';
import '@/styles/globals.css';
import { HeroUIProvider, Spinner } from '@heroui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import {
  NavigateOptions,
  RouterProvider,
  ToOptions,
} from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import PageTransition from './components/PageTransition';
import { router } from './router';
import { PWAProvider } from './hooks/PWAContext';

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

function App() {
  const [persister, setPersister] = useState<any>(null);

  useEffect(() => {
    // Fetch persister asynchronously
    persisterPromise.then(setPersister);
  }, []);

  // Notify index.html splash screen when app is ready to render
  useEffect(() => {
    if (persister) {
      document.dispatchEvent(new Event('app:ready'));
    }
  }, [persister]);

  if (!persister) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <PWAProvider>
        <ThemeProvider>
          <HeroUIProvider
            navigate={(to, options) => router.navigate({ to, ...options })}
            useHref={(to) => router.buildLocation({ to }).href}
          >
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{ persister }}
            >
              <PageTransition>
                <React.Suspense fallback={<Spinner />}>
                  <RouterProvider router={router} />
                </React.Suspense>
              </PageTransition>

              <ReactQueryDevtools initialIsOpen={false} />
            </PersistQueryClientProvider>
          </HeroUIProvider>
        </ThemeProvider>
      </PWAProvider>
    </HelmetProvider>
  );
}

export default App;
