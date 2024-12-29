import PushNotificationA2HS from '@/components/layouts/PushNotificationA2HS';
import Seo from '@/components/layouts/Seo';
import { NavigationProvider } from '@/components/NavigationProvider';
import { SearchProvider } from '@/components/search/SearchContext';
import { ScrollProvider } from '@/hooks/ScrollProvider';
import DefaultLayout from '@/layouts/default';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const isDevelopment = import.meta.env.MODE === 'development';

export const Route = createRootRoute({
  component: () => (
    <SearchProvider>
      <ScrollProvider>
        <NavigationProvider>
          <DefaultLayout>
            <Seo />
            <PushNotificationA2HS />
            <Outlet />
            {isDevelopment && <TanStackRouterDevtools />}
          </DefaultLayout>
        </NavigationProvider>
      </ScrollProvider>
    </SearchProvider> 
  ),
});
