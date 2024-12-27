import { SearchIcon } from '@/components/layouts/icons';
import SutraCard from '@/containers/sutra/SutraCard';
import { useCategory } from '@/hooks/sutra/useCategory';
import { useScrollingStore } from '@/hooks/useScrollingStore';
import { router } from '@/router';
import { Input } from '@nextui-org/react';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/sutra/$category')({
  component: RouteComponent,
});

function RouteComponent() {
  const { scrollContainerRef } = useScrollingStore();

  const {
    data,
    category,

    // Search
    searchTerm,
    setSearchTerm,

    // Audio
    currentlyPlayingId,
    handlePlayAudio,
    handleNextAudio,
  } = useCategory();

  return (
    <div ref={scrollContainerRef} className='max-w-lg mx-auto mb-20'>
      {/* Search Bar */}
      <Input
        aria-label='Search'
        labelPlacement='outside'
        type='search'
        placeholder={`ຄົ້ນຫາພຣະສູດ${category}...`}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-lg',
        }}
        className='mb-4 sticky top-14 z-10 w-full sm:max-w-md md:max-w-lg lg:max-w-xl'
        value={searchTerm}
        startContent={
          <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
        }
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
      />

      {/* Render Filtered Items */}
      <div className='flex flex-col gap-2 mt-4 mb-4'>
        {data?.map((item) => (
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

        {/* Fallback for Empty Data */}
        {!data?.length && (
          <div className='text-center text-gray-600 text-lg'>ບໍ່ພົບຂໍ້ມູນ</div>
        )}
      </div>
    </div>
  );
}
