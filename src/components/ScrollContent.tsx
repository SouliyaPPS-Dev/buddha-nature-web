import { useScrollingStore } from '@/hooks/ScrollProvider';
import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import WoodenBackground from '@/assets/images/wooden_background.jpg';

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

  const isBookRoute = location.pathname.startsWith('/book');
  const isDetailsRoute =
    location.pathname.startsWith('/sutra/details') ||
    location.pathname.startsWith('/favorites/details') ||
    location.pathname.startsWith('/calendar');

  return (
    <section
      ref={scrollContainerRef}
      className='flex flex-col h-screen overflow-y-auto smooth-scroll scrollbar-none'
      style={{
        backgroundImage: !isDetailsRoute ? `url(${WoodenBackground})` : 'none',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: isBookRoute
          ? 'transparent' // Ensure background color doesn't override the image
          : theme === 'light' && isDetailsRoute
            ? '#F6EFD9'
            : theme === 'light'
              ? '#F5F5F5'
              : '#000000',
      }}
    >
      <ScrollToBottom
        className='flex flex-col h-screen overflow-y-auto smooth-scroll scrollbar-none'
        mode='top'
        initialScrollBehavior='smooth'
      >
        {children}
      </ScrollToBottom>
    </section>
  );
}

export default ScrollContent;
