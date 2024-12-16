import PushNotificationA2HS from '@/components/layouts/PushNotificationA2HS';
import Seo from '@/components/layouts/Seo';
import { SearchProvider } from '@/components/search/SearchContext';
import DefaultLayout from '@/layouts/default';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const isDevelopment = import.meta.env.MODE === 'development';

export const Route = createRootRoute({
  component: () => (
    <>
      <Seo />
      <PushNotificationA2HS />
      <SearchProvider>
        <DefaultLayout>
          <Outlet />
        </DefaultLayout>
      </SearchProvider>
      {isDevelopment && <TanStackRouterDevtools />}
    </>
  ),
});
