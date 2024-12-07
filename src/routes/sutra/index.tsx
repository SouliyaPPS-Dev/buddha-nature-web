import { SearchIcon } from '@/components/icons';
import { useSutra } from '@/hooks/sutra/useSutra';
import { Card, CardBody, Image, Input, Spinner } from '@nextui-org/react';

import { createFileRoute, Link } from '@tanstack/react-router';
import { Helmet } from 'react-helmet-async';

export const Route = createFileRoute('/sutra/')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data,
    isLoading,

    // Search
    searchTerm,
    setSearchTerm,
  } = useSutra();

  return (
    <>
      <Helmet>
        <title>Buddhaword</title>
        <meta name='description' content='The Word of Buddha' />
        <meta
          name='keywords'
          content='Buddhaword, ຄຳສອນພຣະພຸດທະເຈົ້າ, ທັມມະ, ທັມມະຊາດ, lao, laos, the word of buddha, buddha, nature'
        />

        {/* Open Graph Metadata (for social cards) */}
        <meta property='og:title' content='Buddhaword | The Word of Buddha' />
        <meta property='og:description' content='ຄຳສອນພຣະພຸດທະເຈົ້າ' />
        <meta
          property='og:image'
          content='https://sutra.web.app/images/logo.png'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://sutra.web.app' />

        {/* Twitter Meta Tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Buddhaword' />
        <meta name='twitter:description' content='The Word of Buddha' />
        <meta
          name='twitter:image'
          content='https://sutra.web.app/images/logo.png'
        />

        {/* Favicon */}
        <link rel='icon' href='/images/logo.png' />
      </Helmet>

      <section className='flex flex-col items-center justify-center'>
        {/* Search Bar */}
        <div className='mb-4 w-full max-w-lg hidden lg:flex'>
          <Input
            aria-label='Search'
            classNames={{
              inputWrapper: 'bg-default-100',
              input: 'text-sm',
            }}
            type='search'
            labelPlacement='outside'
            placeholder='ຄົ້ນຫາພຣະສູດ...'
            value={searchTerm}
            startContent={
              <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
            }
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
        </div>

        {/* Category Filter */}
        {searchTerm === '' && (
          <div className='gap-2 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5'>
            {data?.map((item) => (
              <Link
                key={item.ID}
                to={`/sutra/${item['ໝວດທັມ']}`}
                className='flex justify-center items-center'
              >
                <Card
                  isHoverable
                  key={item.ID}
                  isFooterBlurred
                  className='w-full max-w-[200px] h-auto'
                >
                  <CardBody className='overflow-visible p-0 relative'>
                    {!isLoading && (
                      <div className='absolute inset-0 flex items-center justify-center bg-gray-200'>
                        <Spinner size='sm' />
                      </div>
                    )}
                    <Image
                      removeWrapper
                      shadow='sm'
                      radius='lg'
                      alt={item['ຊື່ພຣະສູດ']}
                      className={`z-0 w-full h-full object-contain transition-opacity duration-300 ${
                        isLoading ? 'opacity-100' : 'opacity-0'
                      }`} // Add smooth transition for images
                      src={`/images/sutra/${item['ໝວດທັມ']}.jpg`} // Dynamically resolve the image path
                      onLoad={isLoading ? () => {} : () => {}} // Update isLoading state
                      onError={() =>
                        console.error(
                          `Failed to load image for ${item['ໝວດທັມ']}`
                        )
                      } // Handle potential errors
                    />
                  </CardBody>
                </Card>
              </Link>
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
