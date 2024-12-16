import { FontSizeProvider } from '@/components/FontSizeProvider';
import { MenuProvider } from '@/components/layouts/MenuProvider';
import { Navbar } from '@/components/layouts/navbar';
import { NavigationTabs } from '@/components/layouts/NavigationTabs';
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
            <main className='container mx-auto max-w-7xl px-6 flex-grow'>
              {children}
            </main>
            {/* Bottom navigation tabs */}
            <NavigationTabs />
          </MenuProvider>
        </ScrollToBottom>
      </FontSizeProvider>
    </div>
  );
}
