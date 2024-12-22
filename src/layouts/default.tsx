import { FontSizeProvider } from '@/components/FontSizeProvider';
import { MenuProvider } from '@/components/layouts/MenuProvider';
import { Navbar } from '@/components/layouts/navbar';
import { NavigationTabs } from '@/components/layouts/NavigationTabs';
import { useTheme } from '@/hooks/use-theme';
import { useRouterState } from '@tanstack/react-router';
import React, { Fragment, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import smoothscroll from 'smoothscroll-polyfill';

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

  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <Fragment>
      <ScrollToBottom
        className='flex flex-col h-screen overflow-y-auto smooth-scroll scrollbar-none'
        mode='top'
        initialScrollBehavior='smooth'
      >
        <div
          className='relative flex flex-col h-screen overflow-y-auto scrollbar-none smooth-scroll'
          style={{
            backgroundColor:
              (theme === 'light' && currentPath === '/sutra/details') ||
              currentPath === '/favorites/details'
                ? '#F6EFD9' // Light theme specific background for this route
                : theme === 'light'
                  ? '#F5F5F5' // Default light theme background
                  : '#000000', // Default dark theme background
          }}
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
        </div>
      </ScrollToBottom>
    </Fragment>
  );
}
