import { SearchIcon } from '@/components/layouts/icons';
import CategoryCard from '@/containers/sutra/CategoryCard';
import SutraCard from '@/containers/sutra/SutraCard';
import { useScrollingStore } from '@/hooks/ScrollProvider';
import { useSutra } from '@/hooks/sutra/useSutra';
import { router } from '@/router';
import { Input } from "@heroui/react";
import { createLazyFileRoute } from '@tanstack/react-router';
import { SetStateAction, useCallback, useMemo } from 'react';

export const Route = createLazyFileRoute('/sutra/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { scrollContainerRef } = useScrollingStore();

  const {
    data,
    isLoading,
    groupedData,
    searchTerm,
    setSearchTerm,
    currentlyPlayingId,
    handlePlayAudio,
    handleNextAudio,
  } = useSutra();

  const handleSearchChange = useCallback(
    (e: { target: { value: SetStateAction<string> } }) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm]
  );
  
  // Memoize filtered data to avoid redundant computations
  const filteredData = useMemo(() => {
    if (searchTerm.trim() === '') {
      return [];
    }
    return data.filter((item) =>
      item['ຊື່ພຣະສູດ'].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  return (
    <section
      ref={scrollContainerRef}
      className='flex flex-col items-center justify-center mb-4'
    >
      {/* Search Bar */}
      <Input
        aria-label='Search'
        labelPlacement='outside'
        type='search'
        placeholder='ຄົ້ນຫາພຣະສູດທັງໝົດ...'
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-lg',
        }}
        className='mb-4 sticky top-14 z-20 w-full sm:max-w-md md:max-w-lg lg:max-w-xl'
        value={searchTerm}
        startContent={
          <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
        }
        onChange={handleSearchChange}
      />

      {/* Category Render */}
      {searchTerm.trim() === '' && !isLoading && (
        <div className='grid gap-2 grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 mb-20'>
          {groupedData.map(([category, items]) => (
            <CategoryCard
              key={category}
              category={category}
              item={items[0]}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Filtered Results Render */}
      {searchTerm.trim() !== '' && (
        <div className='flex flex-col gap-2 mb-20 p-2'>
          {filteredData.map((item) => (
            <SutraCard
              key={item.ID}
              title={item['ຊື່ພຣະສູດ']}
              detail={item['ພຣະສູດ']}
              audio={item['ສຽງ']}
              searchTerm={searchTerm}
              onClick={() => {
                router.navigate({
                  to: `/sutra/details/${item['ID']}${window.location.search}`,
                });
              }}
              route={`/sutra/details/${item['ID']}${window.location.search}`}
              isPlaying={currentlyPlayingId === item.ID}
              onPlay={() => handlePlayAudio(item.ID)}
              onAudioEnd={handleNextAudio} // Move to next audio
            />
          ))}

          {/* Fallback for No Results */}
          {filteredData.length === 0 && (
            <div className='text-center text-white text-lg'>ບໍ່ພົບຂໍ້ມູນ</div>
          )}
        </div>
      )}
    </section>
  );
}
