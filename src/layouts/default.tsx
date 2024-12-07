import React from 'react';
import { Navbar } from '@/components/navbar';
import { NavigationTabs } from '@/components/NavigationTabs';
import { SearchProvider } from '@/components/SearchContext';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative flex flex-col h-screen  overflow-y-auto scrollbar-none'>
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
