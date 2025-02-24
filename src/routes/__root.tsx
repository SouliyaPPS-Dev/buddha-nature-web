import PushNotificationA2HS from '@/components/layouts/PushNotificationA2HS';
import Seo from '@/components/layouts/Seo';
import { NavigationProvider } from '@/components/NavigationProvider';
import { SearchProvider } from '@/components/search/SearchContext';
import { ScrollProvider } from '@/hooks/ScrollProvider';
import DefaultLayout from '@/layouts/default';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import React from 'react';

const isDevelopment = import.meta.env.MODE === 'development';

export const Route = createRootRoute({
  beforeLoad: async () => {
    return (window.location.href =
      'https://buddha-nature.firebaseapp.com/sutra');
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Seo />

      <SearchProvider>
        <ScrollProvider>
          <NavigationProvider>
            <DefaultLayout>
              <PushNotificationA2HS />
              <Outlet />
              {isDevelopment && <TanStackRouterDevtools />}
            </DefaultLayout>
          </NavigationProvider>
        </ScrollProvider>
      </SearchProvider>
    </React.Fragment>
  );
}
