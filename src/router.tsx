import { createRouter as createReactRouter } from '@tanstack/react-router';
import { DefaultCatchBoundary } from './components/layouts/DefaultCatchBoundary';
import { Loading } from './components/layouts/Loading';
import { PageNotFound } from './components/layouts/PageNotFound';
import { routeTree } from './routeTree.gen';

export function createRouter() {
  return createReactRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: PageNotFound,
    defaultPendingComponent: Loading,
  });
}

// Create a new router instance
export const router = createRouter();

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
