import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dhamma/')({
  beforeLoad: async () => {
    // Replace the current history entry with '/sutra' before redirecting to Notion
    window.history.replaceState(null, '', '/sutra');

    // Perform the redirect to the Notion page
    window.location.href =
      'https://buddhaword.notion.site/4d1689680be74b6f96071c8dda16db9e';

    return null; // No need to return anything since we're redirecting
  },
  component: RouteComponent,
});

function RouteComponent() {
  // This component won't be rendered because the user will be redirected before it gets a chance to load
  return null;
}
