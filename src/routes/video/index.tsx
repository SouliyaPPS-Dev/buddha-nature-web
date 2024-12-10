import { title } from '@/components/primitives';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/video/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
        <div className='inline-block max-w-lg text-center justify-center'>
          <h1 className={title()}>Video Comming Soon...</h1>
        </div>
      </section>
    </>
  );
}
