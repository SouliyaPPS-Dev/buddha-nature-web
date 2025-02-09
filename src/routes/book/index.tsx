import { useBook } from '@/hooks/book/useBook';
import { useScrollingStore } from '@/hooks/ScrollProvider';
import { Input, Select, SelectItem, Spinner } from "@heroui/react";
import { createFileRoute } from '@tanstack/react-router';
import { SearchIcon } from '@/components/layouts/icons';
import BookCard from '@/containers/book/BookCard';

export const Route = createFileRoute('/book/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { scrollContainerRef } = useScrollingStore();

  const {
    // Data
    data,
    isLoading,

    // Category
    selectedCategory,
    uniqueCategories,
    setSelectedCategory,

    // Search
    searchTerm,
    setSearchTerm,
  } = useBook();

  return (
    <>
      <section
        ref={scrollContainerRef}
        className='flex flex-col items-center justify-center mb-5'
      >
        {/* Fixed Filter Controls */}
        <div
          className='top-0 z-20 px-4 py-2 mt-12 w-full max-w-lg mx-auto absolute'
          style={{
            marginLeft: '-4px',
          }}
        >
          <div className='grid grid-cols-2 md:grid-cols-2 gap-1 items-center'>
            {/* Search Bar */}
            <div className='w-full'>
              <Input
                aria-label='Search'
                labelPlacement='outside'
                type='search'
                placeholder='ຄົ້ນຫາ...'
                className='bg-default-100 rounded-lg w-full font-phetsarath'
                value={searchTerm}
                startContent={
                  <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
                }
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Dropdown for Category Filtering */}
            <div className='w-full'>
              <Select
                aria-label='Select a category'
                selectedKeys={[selectedCategory || '']}
                onSelectionChange={(e) => {
                  const value = Array.from(e).pop() as string | null;
                  setSelectedCategory(value);
                }}
                classNames={{
                  base: 'bg-default-100 text-lg rounded-lg w-full font-phetsarath',
                  trigger: 'font-phetsarath',
                  listbox: 'font-phetsarath',
                }}
                placeholder='ທຸກໝວດ'
              >
                <SelectItem key='' className='font-phetsarath text-lg'>
                  ທຸກໝວດ
                </SelectItem>
                {uniqueCategories.map((category: string) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className='font-phetsarath text-lg'
                  >
                    {category}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Spacer to prevent content from being hidden behind fixed filters */}
        <div className='h-14'></div>

        {/* Display Loading Spinner if Data is Loading */}
        {isLoading ? (
          <div className='w-full flex justify-center mt-8'>
            <Spinner size='lg' />
          </div>
        ) : (
          <div className='grid gap-4 grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 mb-20'>
            {data?.map((item) => (
              <div
                ref={scrollContainerRef}
                key={item['ID']}
                className='flex flex-col items-center'
                style={{ marginBottom: '-1.3rem' }}
              >
                {/* Book Card */}
                <BookCard id={item['ID']} name={item['ຊື່']} item={item} isLoading={isLoading} />

                {/* Divider (3D Tray with Shadow Effect) */}
                <div
                  className='relative w-full mt-4 h-6 sm:h-5 md:h-6 lg:h-8 z-1'
                  style={{
                    width: '115%',
                    transition: 'width 0.3s ease-in-out',
                  }}
                >
                  {/* Top Shelf */}
                  <div className='absolute top-0 left-0 w-full h-1 sm:h-3 md:h-4 bg-[#B96A44] shadow-lg'></div>

                  {/* Middle Edge */}
                  <div
                    className='absolute top-1 left-0 w-full h-2 sm:h-1.5 bg-[#E0895C] shadow mb-0'
                    style={{ marginBottom: '-5.5em' }}
                  ></div>

                  {/* Bottom Shelf */}
                  <div className='absolute bottom-0 left-0 w-full h-1 bg-[#A65D3B] shadow-inner mb-4'></div>
                  <div className='absolute bottom-0 left-0 w-full h-1 mb:h-1 sm:h-2 lg:h-2 bg-[#B96A44] shadow-inner mb-3'></div>

                  {/* Glossy Effect */}
                  <div className='absolute top-0 left-0 w-full h-4 bg-[#E0895C] opacity-50'></div>

                  {/* Book Shadow Effect */}
                  <div className='absolute -top-2 left-2 w-[96%] h-4 bg-black opacity-10 blur-md'></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
