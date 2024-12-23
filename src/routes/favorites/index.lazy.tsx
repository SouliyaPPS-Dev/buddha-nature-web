import { SearchIcon } from '@/components/layouts/icons';
import SutraCard from '@/containers/sutra/SutraCard';
import { useFavorites } from '@/hooks/favorites/useFavorites';
import { router } from '@/router';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/favorites/')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data,
    // Category
    selectedCategory,
    uniqueCategories,
    setSelectedCategory,

    // Search
    searchTerm,
    setSearchTerm,
  } = useFavorites();

  return (
    <section className='max-w-lg mx-auto mb-0'>
      <div className='grid grid-cols-2 md:grid-cols-2 gap-0 mt-3'>
        {/* Search Bar */}
        <div>
          <Input
            aria-label='Search'
            labelPlacement='outside'
            type='search'
            placeholder={`ຄົ້ນຫາພຣະສູດຖືກໃຈ...`}
            classNames={{
              inputWrapper: 'bg-default-100',
              input: 'text-sm',
            }}
            className='mb-0 sticky top-14 z-10 w-full sm:max-w-md md:max-w-lg lg:max-w-xl'
            value={searchTerm}
            startContent={
              <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
            }
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
        </div>

        {/* Dropdown for Category Filtering */}
        <div
          style={{
            marginTop: '-0.5rem',
            fontSize: '26px',
          }}
        >
          <Select
            selectedKeys={[selectedCategory || '']}
            onSelectionChange={(e) => {
              const value = Array.from(e).pop() as string | null; // Ensure type matches
              setSelectedCategory(value);
            }}
            classNames={{
              base: 'bg-default-100 text-lg rounded-lg w-full font-phetsarath mt-2 ml-1',
              trigger: 'font-phetsarath',
              listbox: 'font-phetsarath',
            }}
            placeholder='ທຸກໝວດ'
          >
            <SelectItem key='' className='font-phetsarath'>
              ທຸກໝວດ
            </SelectItem>
            {uniqueCategories.map((category: any) => (
              <SelectItem
                key={category}
                value={category}
                className='font-phetsarath'
              >
                {category}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Render Filtered Items */}
      <div className='flex flex-col gap-2 mt-4 mb-4'>
        {data?.map((item: any) => (
          <SutraCard
            key={item.ID}
            title={item['ຊື່ພຣະສູດ']}
            detail={item['ພຣະສູດ']}
            searchTerm={searchTerm}
            onClick={() => {
              router.navigate({
                to: `/favorites/details/${item['ໝວດທັມ']}/${item['ຊື່ພຣະສູດ']}${window.location.search}`,
              });
            }}
            route={`/favorites/details/${item['ໝວດທັມ']}/${item['ຊື່ພຣະສູດ']}${window.location.search}`}
          />
        ))}

        {/* Fallback for Empty Data */}
        {!data?.length && (
          <div className='text-center text-gray-600 text-lg'>ບໍ່ພົບຂໍ້ມູນ</div>
        )}
      </div>
    </section>
  );
}
