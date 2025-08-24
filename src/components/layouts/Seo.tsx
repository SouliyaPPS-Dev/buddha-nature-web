import { Helmet } from 'react-helmet-async';

type SeoProps = {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  noIndex?: boolean;
  schemaJson?: Record<string, any> | null;
};

function Seo({
  title = 'Buddhaword',
  description = 'ຄຳສອນພຣະພຸດທະເຈົ້າ',
  keywords = 'Buddhaword, ຄຳສອນພຣະພຸດທະເຈົ້າ, ທັມມະ, ທັມມະຊາດ, lao, laos, the word of buddha, buddha, nature',
  image = 'https://buddha-nature.firebaseapp.com/images/logo.png',
  url = 'https://buddha-nature.firebaseapp.com',
  type = 'website',
  canonical,
  noIndex = false,
  schemaJson = null,
}: SeoProps) {
  return (
    <Helmet prioritizeSeoTags>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <title>{title}</title>
      {noIndex ? (
        <meta name='robots' content='noindex, nofollow' />
      ) : (
        <meta name='robots' content='index, follow' />
      )}
      {description && <meta name='description' content={description} />}
      {keywords && <meta name='keywords' content={keywords} />}
      <link rel='manifest' href='/manifest.json' />

      {/* Open Graph */}
      <meta property='og:title' content={title} />
      {description && <meta property='og:description' content={description} />}
      {image && <meta property='og:image' content={image} />}      
      <meta property='og:type' content={type} />
      <meta property='og:site_name' content='Buddhaword' />
      {url && <meta property='og:url' content={url} />}

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      {description && (
        <meta name='twitter:description' content={description} />
      )}
      {image && <meta name='twitter:image' content={image} />}

      {/* Icons / PWA */}
      <link rel='icon' type='image/png' href='/images/logo.png' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='#FFAF5D' />
      <meta name='apple-mobile-web-app-title' content='Buddha-Nature' />
      <meta name='theme-color' content='#FFAF5D' />
      <link rel='apple-touch-icon' href='/images/logo.png' />

      {/* Canonical */}
      {canonical && <link rel='canonical' href={canonical} />}

      {/* JSON-LD */}
      {schemaJson && (
        <script type='application/ld+json'>
          {JSON.stringify(schemaJson)}
        </script>
      )}
    </Helmet>
  );
}

export default Seo;
