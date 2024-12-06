import DefaultLayout from '@/layouts/default';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const isDevelopment = import.meta.env.MODE === 'development';

export const Route = createRootRoute({
  component: () => (
    <>
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
      {isDevelopment && <TanStackRouterDevtools />}
    </>
  ),
});
