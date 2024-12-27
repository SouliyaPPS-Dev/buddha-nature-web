import { useScrollingStore } from '@/hooks/ScrollProvider';
import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

/**
 * ✅ Separate `ScrollContent` Component to Avoid `useScrollingStore` Issue
 */
function ScrollContent({
  theme,
  location,
  children,
}: {
  theme: string;
  location: { pathname: string };
  children: React.ReactNode;
}) {
  const { scrollContainerRef } = useScrollingStore();

  return (
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
        {children}
      </ScrollToBottom>
    </div>
  );
}

export default ScrollContent;
