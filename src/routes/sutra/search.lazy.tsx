import { SearchIcon } from '@/components/layouts/icons';
import SutraCard from '@/containers/sutra/SutraCard';
import { useSutra } from '@/hooks/sutra/useSutra';
import { useScrollingStore } from '@/hooks/useScrollingStore';
import { router } from '@/router';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/sutra/search')({
  component: RouteComponent,
});

function RouteComponent() {
  const { scrollContainerRef } = useScrollingStore();

  const {
    data,

    // Search
    searchTerm,
    setSearchTerm,

    // Category
    selectedCategory,
    setSelectedCategory,
    uniqueCategories,

    // Sound
    currentlyPlayingId,
    handlePlayAudio,
    handleNextAudio,
  } = useSutra();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      // Force focus with a small delay to ensure rendering completes
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, []);

  return (
    <section ref={scrollContainerRef} className='max-w-lg mx-auto mb-0'>
      {/* Fixed Filter Controls */}
      <div
        className='absolute top-0 z-10 px-4 py-2 mt-12 w-full max-w-lg mx-auto'
        style={{
          marginLeft: '-4px',
        }}
      >
        <div className='grid grid-cols-2 md:grid-cols-2 gap-2 items-center'>
          {/* Search Bar */}
          <div className='w-full'>
            <Input
              ref={inputRef} // Attach ref to the input
              aria-label='Search'
              labelPlacement='outside'
              type='search'
              placeholder='ຄົ້ນຫາພຣະສູດທັງໝົດ...'
              classNames={{
                inputWrapper: 'bg-default-100',
              }}
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
              {uniqueCategories.map((category: any) => (
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
      <div className='h-8'></div>

      {/* Render Filtered Items */}
      <div className='flex flex-col gap-2 mt-4 mb-20 p-2'>
        {data
          ?.slice()
          .reverse()
          .map((item: any) => (
            <SutraCard
              key={item.ID}
              title={item['ຊື່ພຣະສູດ']}
              detail={item['ພຣະສູດ']}
              audio={item['ສຽງ']}
              searchTerm={searchTerm}
              onClick={() => {
                router.navigate({
                  to: `/sutra/details/${item['ໝວດທັມ']}/${item['ຊື່ພຣະສູດ']}${window.location.search}`,
                });
              }}
              route={`/sutra/details/${item['ໝວດທັມ']}/${item['ຊື່ພຣະສູດ']}${window.location.search}`}
              isPlaying={currentlyPlayingId === item.ID}
              onPlay={() => handlePlayAudio(item.ID)}
              onAudioEnd={handleNextAudio}
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
