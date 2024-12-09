import Seo from '@/components/Seo'
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/video/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Seo />
      <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'></section>
    </>
  );
}
