import { ThemeProvider } from '@/hooks/use-theme';
import { persisterPromise, queryClient } from '@/services/react-query/client';
import '@/styles/globals.css';
import { HeroUIProvider } from '@heroui/react';
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

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => console.log('Service Worker registered!'))
    .catch((error) =>
      console.error('Service Worker registration failed:', error)
    );
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
    return <div>Loading...</div>; // Avoid rendering before persister is ready
  }

  return (
    <HelmetProvider>
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
              <React.Suspense fallback={<div>Loading...</div>}>
                <RouterProvider router={router} />
                {isServiceWorkerActive}
              </React.Suspense>
            </PageTransition>

            <ReactQueryDevtools initialIsOpen={false} />
          </PersistQueryClientProvider>
        </HeroUIProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
