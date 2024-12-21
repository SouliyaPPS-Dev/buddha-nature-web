import { FontSizeProvider } from '@/components/FontSizeProvider';
import { MenuProvider } from '@/components/layouts/MenuProvider';
import { Navbar } from '@/components/layouts/navbar';
import { NavigationTabs } from '@/components/layouts/NavigationTabs';
import { SearchProvider } from '@/components/search/SearchContext';
import { useTheme } from '@/hooks/use-theme';
import { useRouterState } from '@tanstack/react-router';
import React, { Fragment } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const location = useRouterState({ select: (state) => state.location });

  // Split the path by "/"
  const pathSegments = location.pathname.split('/');

  // Join the first three segments to get '/sutra/details'
  const currentPath = `/${pathSegments[1]}/${pathSegments[2]}`;

  return (
    <Fragment>
      <div
        className='relative flex flex-col h-screen overflow-y-auto scrollbar-none smooth-scroll'
        style={{
          backgroundColor:
            theme === 'light' && currentPath === '/sutra/details'
              ? '#F6EFD9' // Light theme specific background for this route
              : theme === 'light'
                ? '#F5F5F5' // Default light theme background
                : '#000000', // Default dark theme background
        }}
      >
        <FontSizeProvider>
          <ScrollToBottom
            className='h-screen flex flex-col'
            mode='top'
            initialScrollBehavior='smooth'
            scrollViewClassName='scrollbar-none smooth-scroll overflow-y-auto'
          >
            <MenuProvider>
              <SearchProvider>
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
              </SearchProvider>
            </MenuProvider>
          </ScrollToBottom>
        </FontSizeProvider>
      </div>
    </Fragment>
  );
}
