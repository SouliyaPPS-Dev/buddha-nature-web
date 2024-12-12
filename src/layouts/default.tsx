import React from 'react';
import { Navbar } from '@/components/layouts/navbar';
import { NavigationTabs } from '@/components/layouts/NavigationTabs';
import { SearchProvider } from '@/components/search/SearchContext';
import '@/styles/globals.css';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative flex flex-col h-screen overflow-y-auto scrollbar-none smooth-scroll'>
      <SearchProvider>
        {/* Top navbar */}
        <Navbar />
        {/* Main content */}
        <main className='container mx-auto max-w-7xl px-6 flex-grow'>
          {children}
        </main>
        {/* Bottom navigation tabs */}
        <NavigationTabs />
      </SearchProvider>
    </div>
  );
}
