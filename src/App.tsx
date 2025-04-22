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
  const [isServiceWorkerActive, setIsServiceWorkerActive] = useState(false);

  useEffect(() => {
    // Fetch persister asynchronously
    persisterPromise.then(setPersister);

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log(
              'ServiceWorker registration successful with scope: ',
              registration.scope
            );
            setIsServiceWorkerActive(true);
          })
          .catch((error) => {
            console.error('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);

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
                  {isServiceWorkerActive}
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
