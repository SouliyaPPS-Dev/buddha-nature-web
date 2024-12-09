import { Helmet } from 'react-helmet-async';

function Seo() {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>Buddhaword | The Word of Buddha</title>
      <meta
        name='description'
        content='Explore the teachings of Buddha in the most profound and enlightening way. Discover nature, wisdom, and inner peace.'
      />
      <meta
        name='keywords'
        content='Buddhaword, ຄຳສອນພຣະພຸດທະເຈົ້າ, ທັມມະ, ທັມມະຊາດ, lao, laos, the word of buddha, buddha, nature, mindfulness, meditation'
      />

      {/* Open Graph Metadata (for social cards) */}
      <meta property='og:title' content='Buddhaword | The Word of Buddha' />
      <meta
        property='og:description'
        content='Explore the teachings of Buddha in the most profound and enlightening way. Discover nature, wisdom, and inner peace.'
      />
      <meta
        property='og:image'
        content='https://sutra.web.app/images/logo.png'
      />
      <meta property='og:type' content='website' />
      <meta property='og:url' content='https://sutra.web.app' />
    </Helmet>
  );
}

export default Seo;
