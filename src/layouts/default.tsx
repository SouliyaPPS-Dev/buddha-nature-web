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

  return (
    <Fragment>
      {/* Inside ScrollProvider, now useScrollingStore is valid */}
      <ScrollContent theme={theme} location={location}>
        <FontSizeProvider>
          <MenuProvider>
            {/* Top navbar */}
            <Navbar />
            {/* Main content */}
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
            {/* Bottom navigation tabs */}
            <div className='hidden md:block'>
              {/* Mobile screens only */}
              <NavigationTabs />
            </div>
          </MenuProvider>
        </FontSizeProvider>
      </ScrollContent>
    </Fragment>
  );
}
