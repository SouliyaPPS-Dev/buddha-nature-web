import Seo from '@/components/Seo';
import { useCategory } from '@/hooks/sutra/useCategory';
import { Card, CardBody, Input } from '@nextui-org/react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sutra/$category')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data,
    category,

    // Search
    searchTerm,
    setSearchTerm,
  } = useCategory();

  return (
    <>
      <Seo />
      <section className='max-w-lg mx-auto'>
        {/* Search Bar */}
        <Input
          placeholder={`ຄົ້ນຫາພຣະສູດ${category}...`}
          className='mb-0 p-4 mx-auto sticky top-14 z-10 w-full max-w-lg'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />

        {/* Render Filtered Items */}
        <div className='flex flex-col gap-2'>
          {data?.map((item) => (
            <Card key={item.ID} className='cursor-pointer'>
              <CardBody>{item['ຊື່ພຣະສູດ']}</CardBody>
            </Card>
          ))}

          {/* Fallback for Empty Data */}
          {!data?.length && (
            <div className='text-center text-gray-600'>ບໍ່ພົບຂໍ້ມູນ</div>
          )}
        </div>
      </section>
    </>
  );
}
