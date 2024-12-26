import { FontSizeProvider } from '@/components/FontSizeProvider';
import { MenuProvider } from '@/components/layouts/MenuProvider';
import { Navbar } from '@/components/layouts/navbar';
import { NavigationTabs } from '@/components/layouts/NavigationTabs';
import { useTheme } from '@/hooks/use-theme';
import { useScrollingStore } from '@/hooks/useScrollingStore';
import { useRouterState } from '@tanstack/react-router';
import React, { Fragment } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollContainerRef } = useScrollingStore();
  const { theme } = useTheme();
  const location = useRouterState({ select: (state) => state.location });

  return (
    <Fragment>
      <div
        ref={scrollContainerRef}
        className='flex flex-col h-screen overflow-y-auto smooth-scroll scrollbar-none'
        style={{
          backgroundColor:
            theme === 'light' &&
            (location.pathname.startsWith('/sutra/details') ||
              location.pathname.startsWith('/favorites/details'))
              ? '#F6EFD9' // Light theme specific background for these routes
              : theme === 'light'
                ? '#F5F5F5' // Default light theme background
                : '#000000', // Default dark theme background
        }}
      >
        <ScrollToBottom
          className='flex flex-col h-screen overflow-y-auto smooth-scroll scrollbar-none'
          mode='top'
          initialScrollBehavior='smooth'
        >
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
        </ScrollToBottom>
      </div>
    </Fragment>
  );
}
