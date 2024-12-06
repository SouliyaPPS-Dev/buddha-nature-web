import { useSutra } from '@/hooks/sutra/useSutra';
import { Card, CardBody, Image, Spinner } from '@nextui-org/react';

import { createFileRoute, Link } from '@tanstack/react-router';
import { Helmet } from 'react-helmet-async';

export const Route = createFileRoute('/sutra/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { categories, isLoading } = useSutra();

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

      <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
        <div className='gap-2 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5'>
          {categories.map((category) => (
            <Link
              key={category}
              to={`/sutra/${category}`}
              className='flex justify-center items-center'
            >
              <Card
                isHoverable
                key={category}
                isFooterBlurred
                className='w-full max-w-[200px] h-auto'
              >
                <CardBody className='overflow-visible p-0 relative'>
                  {!isLoading && (
                    // Show a loading spinner or placeholder while the image is loading
                    <div className='absolute inset-0 flex items-center justify-center bg-gray-200'>
                      <Spinner size='sm' />
                    </div>
                  )}
                  <Image
                    removeWrapper
                    shadow='sm'
                    radius='lg'
                    alt={category}
                    className={`z-0 w-full h-full object-contain transition-opacity duration-300 ${
                      isLoading ? 'opacity-100' : 'opacity-0'
                    }`} // Add smooth transition for images
                    src={`/images/sutra/${category}.jpg`} // Dynamically resolve the image path
                    onLoad={isLoading ? () => {} : () => {}} // Update isLoading state
                    onError={() =>
                      console.error(`Failed to load image for ${category}`)
                    } // Handle potential errors
                  />
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
