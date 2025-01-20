import { ThemeProvider } from '@/hooks/use-theme';
import { persister, queryClient } from '@/services/react-query/client';
import '@/styles/globals.css';
import { HeroUIProvider } from '@heroui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import {
  NavigateOptions,
  RouterProvider,
  ToOptions,
} from '@tanstack/react-router';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import PageTransition from './components/PageTransition';
import { router } from './router';

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

function App() {
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
            {/* Wrapping only the page content inside the transition */}
            <PageTransition>
              <React.Suspense fallback={<div>Loading...</div>}>
                <RouterProvider router={router} />
              </React.Suspense>
            </PageTransition>

            {/* Add React Query Devtools */}
            <ReactQueryDevtools initialIsOpen={false} />
          </PersistQueryClientProvider>
        </HeroUIProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
