import { Helmet } from 'react-helmet-async';

type JsonLd = Record<string, any>;

type SeoProps = {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  noIndex?: boolean;
  schemaJson?: JsonLd | JsonLd[] | null;
};

function Seo({
  title = 'ຄຳສອນພຸດທະ',
  description = 'ຄຳສອນພຣະພຸດທະເຈົ້າ',
  keywords = [
    // English
    'Buddhaword',
    'The Word of Buddha for Research Educational',
    'Buddha Nature',
    'The Word of Buddha',
    'Dhamma',
    'Research',
    'Educational',
    'lao',
    'laos',
    'app',
    'buddha',
    'nature',
    // Lao
    'ຄຳສອນພຸດທະ',
    'ຄຳສອນພຣະພຸດທະເຈົ້າ',
    'ທັມ',
    'ທັມມະ',
    'ທຳມະ',
    'ພຸດທະ',
    'ລາວ',
  ].join(', '),
  image = 'https://buddhaword.net/logo_wutdarn.png',
  url = 'https://buddhaword.net',
  type = 'website',
  canonical,
  noIndex = false,
  schemaJson = null,
}: SeoProps) {
  // Compute sensible defaults on the client when not provided
  const isClient = typeof window !== 'undefined';
  const computedUrl = isClient ? window.location.href : url;
  const computedCanonical = isClient
    ? `${window.location.origin}${window.location.pathname}`
    : canonical;

  const jsonLdArray: JsonLd[] = Array.isArray(schemaJson)
    ? schemaJson
    : schemaJson
    ? [schemaJson]
    : [];

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
      <meta property='og:site_name' content='ຄຳສອນພຸດທະ' />
      <meta property='og:locale' content='lo_LA' />
      <meta property='og:url' content={computedUrl || url} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      {description && (
        <meta name='twitter:description' content={description} />
      )}
      {image && <meta name='twitter:image' content={image} />}

      {/* Icons / PWA */}
      <link rel='icon' type='image/png' href='/logo_wutdarn.png' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='#FFAF5D' />
      <meta name='apple-mobile-web-app-title' content='ຄຳສອນພຸດທະ' />
      <meta name='theme-color' content='#FFAF5D' />
      <link rel='apple-touch-icon' href='/logo_wutdarn.png' />

      {/* Canonical */}
      <link rel='canonical' href={canonical || computedCanonical || url} />

      {/* JSON-LD */}
      {jsonLdArray.map((entry, idx) => (
        <script key={idx} type='application/ld+json'>
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}

export default Seo;
