import { title } from '@/components/primitives';
import Seo from '@/components/Seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/calendar/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Seo />
      <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
        <div className='inline-block max-w-lg text-center justify-center'>
          <h1 className={title()}>Calendar</h1>
        </div>
      </section>
    </>
  );
}
