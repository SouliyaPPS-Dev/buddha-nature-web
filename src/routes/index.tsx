import { createFileRoute } from '@tanstack/react-router';
import { Helmet } from 'react-helmet-async';

// Define the route
export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      {/* Helmet to dynamically set metadata for this specific route */}
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

    </>
  );
}
