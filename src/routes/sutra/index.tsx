import { SearchIcon } from '@/components/icons';
import CategoryCard from '@/containers/sutra/CategoryCard';
import { useSutra } from '@/hooks/sutra/useSutra';
import { Card, CardBody, Input } from '@nextui-org/react';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sutra/')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data,
    isLoading,
    getGroupedData,
    // Search
    searchTerm,
    setSearchTerm,
  } = useSutra();

  return (
    <>
      <section className='flex flex-col items-center justify-center'>
        {/* Search Bar */}

        <Input
          aria-label='Search'
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm',
          }}
          className='mb-0 p-4 mx-auto sticky top-14 z-10 w-full max-w-lg'
          type='search'
          labelPlacement='outside'
          placeholder='ຄົ້ນຫາພຣະສູດທັງໝົດ...' // Translates to "Search for Sutra"
          value={searchTerm}
          startContent={
            <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
          }
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />

        {/* Category Filter */}
        {searchTerm === '' && (
          <div className='gap-2 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5'>
            {getGroupedData().map(([category, item]) => (
              <CategoryCard
                key={category}
                category={category}
                item={item}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}

        {/* Render Filtered Items */}
        {searchTerm !== '' && (
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
        )}
      </section>
    </>
  );
}
