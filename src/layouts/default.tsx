import { FontSizeProvider } from '@/components/FontSizeProvider';
import { MenuProvider } from '@/components/layouts/MenuProvider';
import { Navbar } from '@/components/layouts/navbar';
import { NavigationTabs } from '@/components/layouts/NavigationTabs';
import ScrollContent from '@/components/ScrollContent';
import { useScrollingStore } from '@/hooks/ScrollProvider';
import { useTheme } from '@/hooks/use-theme';
import { useRouterState } from '@tanstack/react-router';
import React, { Fragment, useEffect, useState } from 'react';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollContainerRef } = useScrollingStore();
  const { theme } = useTheme();
  const location = useRouterState({ select: (state) => state.location });
  const [isDesktopOrTablet, setIsDesktopOrTablet] = useState(
    window.innerWidth >= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopOrTablet(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = !isDesktopOrTablet; // Mobile is when width < 768px

  const isBookRoute = location.pathname.startsWith('/book/view/');
  const isVideoRoute = location.pathname.startsWith('/video/view/');
  const shouldShowNavTabs = [
    '/sutra',
    '/favorites',
    '/book',
    '/video',
    '/calendar',
  ].includes(location.pathname);

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
            {isMobile && shouldShowNavTabs && <NavigationTabs />}
            {isDesktopOrTablet && <NavigationTabs />}
          </MenuProvider>
        </FontSizeProvider>
      </ScrollContent>
    </Fragment>
  );
}
