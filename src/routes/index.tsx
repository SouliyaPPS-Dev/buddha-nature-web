import { createFileRoute, redirect } from '@tanstack/react-router';

// Define the route
export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    return redirect({
      to: '/sutra',
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* Redirect-only route; no content needed */}
    </>
  );
}
