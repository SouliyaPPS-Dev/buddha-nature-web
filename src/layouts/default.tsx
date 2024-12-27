import { FontSizeProvider } from '@/components/FontSizeProvider';
import { MenuProvider } from '@/components/layouts/MenuProvider';
import { Navbar } from '@/components/layouts/navbar';
import { NavigationTabs } from '@/components/layouts/NavigationTabs';
import ScrollContent from '@/components/ScrollContent';
import { useTheme } from '@/hooks/use-theme';
import { useRouterState } from '@tanstack/react-router';
import React, { Fragment } from 'react';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const location = useRouterState({ select: (state) => state.location });

  return (
    <Fragment>
      {/* Inside ScrollProvider, now useScrollingStore is valid */}
      <ScrollContent theme={theme} location={location}>
        <FontSizeProvider>
          <MenuProvider>
            {/* Top navbar */}
            <Navbar />
            {/* Main content */}
            <main className='container mx-auto max-w-7xl px-2 flex-grow'>
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
