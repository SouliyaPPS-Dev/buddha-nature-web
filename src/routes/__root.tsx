import PushNotificationA2HS from '@/components/layouts/PushNotificationA2HS';
import PushNotificationPlayStore from '@/components/layouts/PushNotificationPlayStore';
import Seo from '@/components/layouts/Seo';
import { NavigationProvider } from '@/components/NavigationProvider';
import { SearchProvider } from '@/components/search/SearchContext';
import { ScrollProvider } from '@/hooks/ScrollProvider';
import DefaultLayout from '@/layouts/default';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import React from 'react';

const isDevelopment = import.meta.env.MODE === 'development';

export const Route = createRootRoute({
  // beforeLoad: async () => {
  //   return (window.location.href =
  //     'https://buddhaword.net/sutra');
  // },
  component: RootComponent,
});

function RootComponent() {
  const location = useRouterState({ select: (state) => state.location });
  const isClient = typeof window !== 'undefined';
  const pageUrl = isClient ? window.location.href : 'https://buddhaword.net';
  const canonical = isClient
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://buddhaword.net';

  const siteSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ຄຳສອນພຸດທະ',
      url: 'https://buddhaword.net',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://buddhaword.net/sutra/search?query={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ຄຳສອນພຸດທະ',
      url: 'https://buddhaword.net',
      logo: 'https://buddhaword.net/logo_wutdarn.png',
    },
  ];
  return (
    <React.Fragment>
      <Seo
        title={'ຄຳສອນພຸດທະ'}
        description={'ຄັງຄວາມຮູ້ ແລະ ຄຳສອນຂອງພຣະພຸດທະເຈົ້າ ພາສາລາວ'}
        keywords={[
          'ຄຳສອນພຸດທະ',
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
          'ຄຳສອນພຣະພຸດທະເຈົ້າ',
          'ທັມ',
          'ທັມມະ',
          'ທຳມະ',
          'ພຸດທະ',
          'ລາວ',
        ].join(', ')}
        url={pageUrl}
        canonical={canonical}
        type='website'
        schemaJson={siteSchema}
      />

      <SearchProvider>
        <ScrollProvider>
          <NavigationProvider>
            <DefaultLayout>
              {(location.pathname === '/' || location.pathname === '/sutra') && (
                <>
                  <PushNotificationPlayStore />
                  <PushNotificationA2HS />
                </>
              )}
              <Outlet />
              {isDevelopment && <TanStackRouterDevtools />}
            </DefaultLayout>
          </NavigationProvider>
        </ScrollProvider>
      </SearchProvider>
    </React.Fragment>
  );
}
