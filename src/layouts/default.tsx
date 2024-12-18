import { FontSizeProvider } from '@/components/FontSizeProvider';
import { MenuProvider } from '@/components/layouts/MenuProvider';
import { Navbar } from '@/components/layouts/navbar';
import { NavigationTabs } from '@/components/layouts/NavigationTabs';
import { SearchProvider } from '@/components/search/SearchContext';
import '@/styles/globals.css';
import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative flex flex-col h-screen overflow-y-auto scrollbar-none smooth-scroll'>
      <SearchProvider>
        <FontSizeProvider>
          <ScrollToBottom
            className='h-screen flex flex-col'
            mode='top'
            initialScrollBehavior='smooth'
            scrollViewClassName='scrollbar-none'
          >
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
          </ScrollToBottom>
        </FontSizeProvider>
      </SearchProvider>
    </div>
  );
}
