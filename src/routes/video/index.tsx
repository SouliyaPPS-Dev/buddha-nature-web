import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/video/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'></section>
    </>
  );
}
