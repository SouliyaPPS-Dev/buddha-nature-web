import { FontSizeProvider } from '@/components/FontSizeProvider';
import { MenuProvider } from '@/components/layouts/MenuProvider';
import { Navbar } from '@/components/layouts/navbar';
import { NavigationTabs } from '@/components/layouts/NavigationTabs';
import ScrollContent from '@/components/ScrollContent';
import { useScrollingStore } from '@/hooks/ScrollProvider';
import { useTheme } from '@/hooks/use-theme';
import { useRouterState } from '@tanstack/react-router';
import React, { Fragment } from 'react';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollContainerRef } = useScrollingStore();
  const { theme } = useTheme();
  const location = useRouterState({ select: (state) => state.location });

  const isBookRoute = location.pathname.startsWith('/book/view/');
  const isVideoRoute = location.pathname.startsWith('/video/view/');
  const isSutraMenuRoute = '/sutra';
  const isFavoritesMenuRoute = '/favorites';
  const isBooksMenuRoute = '/book';
  const isVideoMenuRoute = '/video';
  const isCalendarMenuRoute = '/calendar';

  const shouldShowNavTabs =
    isSutraMenuRoute ||
    isFavoritesMenuRoute ||
    isBooksMenuRoute ||
    isVideoMenuRoute ||
    isCalendarMenuRoute;

  return (
    <Fragment>
      <ScrollContent theme={theme} location={location}>
        <FontSizeProvider>
          <MenuProvider>
            <Navbar />
            <main
              ref={scrollContainerRef}
              className={`flex-grow ${
                isBookRoute || isVideoRoute
                  ? ''
                  : 'container mx-auto max-w-7xl px-2'
              }`}
            >
              {children}
            </main>
            {location.pathname === shouldShowNavTabs && <NavigationTabs />}
          </MenuProvider>
        </FontSizeProvider>
      </ScrollContent>
    </Fragment>
  );
}
