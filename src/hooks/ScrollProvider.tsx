import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useRouterState } from '@tanstack/react-router';
import smoothscroll from 'smoothscroll-polyfill';

// 📝 Define Context Interface
interface ScrollContextProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

// 📝 Create Context
const ScrollContext = createContext<ScrollContextProps | undefined>(undefined);

// ✅ Scroll Provider Component
export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  const location = useRouterState({ select: (state) => state.location });

  // ✅ Enable smooth scrolling polyfill
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  /**
   * ✅ Save Scroll Position Before Navigation
   */
  const saveScrollPosition = () => {
    const path = location.pathname;
    const position =
      scrollContainerRef.current?.scrollTop || window.scrollY || 0;
    scrollPositions.current[path] = position;
  };

  /**
   * ✅ Restore Scroll Position After Navigation
   */

  const restoreScrollPosition = () => {
    const path = location.pathname;
    const savedPosition = scrollPositions.current[path] || 0;

    requestAnimationFrame(() => {
      const scrollTarget =
        scrollContainerRef.current ?? document.documentElement;
      scrollTarget.scrollTo({
        top: savedPosition,
        behavior: 'smooth',
      });
    });
  };

  /**
   * ✅ Scroll to Bottom for Specific Route (`/sutra`)
   */
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      }
    });
  };

  /**
   * ✅ Handle Route Changes
   */
  useEffect(() => {
    // Save current scroll position before leaving
    saveScrollPosition();

    if (location.pathname) {
      // Auto-scroll down if route is `/sutra`
      scrollToBottom();
    } else {
      // Restore scroll position for other routes
      const isNavigatingBackOrForward = window.performance
        .getEntriesByType('navigation')
        .some(
          (nav) => (nav as PerformanceNavigationTiming).type === 'back_forward'
        );

      if (isNavigatingBackOrForward) {
        restoreScrollPosition();
      } else {
        // Default behavior for new routes
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          } else {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        });
      }
    }
  }, [location.pathname]);

  /**
   * ✅ Save Scroll Position on Unmount
   */
  useEffect(() => {
    if (!('scrollBehavior' in document.documentElement.style)) {
      smoothscroll.polyfill();
    }
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollContainerRef }}>
      {children}
    </ScrollContext.Provider>
  );
};

// ✅ Custom Hook to Use Scroll Context
export const useScrollingStore = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollingStore must be used within a ScrollProvider');
  }
  return context;
};
