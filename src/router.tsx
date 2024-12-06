import { createRouter as createReactRouter } from '@tanstack/react-router';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { Loading } from './components/Loading';
import { PageNotFound } from './components/PageNotFound';
import { routeTree } from './routeTree.gen';

export function createRouter() {
  return createReactRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: PageNotFound,
    defaultPendingComponent: Loading, // Add default loading component here
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
