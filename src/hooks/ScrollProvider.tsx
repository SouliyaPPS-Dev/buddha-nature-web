import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useLayoutEffect,
  ReactNode,
} from 'react';
import { useRouter } from '@tanstack/react-router';
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
  const router = useRouter();

  // ✅ Enable smooth scroll polyfill (for better cross-browser support)
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  /**
   * ✅ Get current route key
   */
  const getRouteKey = () => {
    const currentRoute = router.state.location;
    return `${currentRoute.pathname}?${currentRoute.search || ''}`;
  };

  /**
   * ✅ Save Scroll Position
   */
  const saveScrollPosition = () => {
    const routeKey = getRouteKey();
    const scrollPosition =
      scrollContainerRef.current?.scrollTop || window.scrollY;

    scrollPositions.current[routeKey] = scrollPosition;
  };

  /**
   * ✅ Restore Scroll Position
   */
  const restoreScrollPosition = () => {
    const routeKey = getRouteKey();
    const savedPosition = scrollPositions.current[routeKey] || 0;

    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: savedPosition,
          behavior: 'auto',
        });
      } else {
        window.scrollTo({
          top: savedPosition,
          behavior: 'auto',
        });
      }
    });
  };

  /**
   * ✅ Handle Scroll Position on Navigation
   */
  useEffect(() => {
    const handleBeforeNavigate = () => {
      saveScrollPosition();
    };

    const unsubscribeBeforeNavigate = router.subscribe(
      'onBeforeNavigate',
      handleBeforeNavigate
    );

    // Route change listener via useEffect
    const unlisten = router.subscribe('onBeforeLoad', restoreScrollPosition);

    window.addEventListener('popstate', restoreScrollPosition);
    window.addEventListener('beforeunload', saveScrollPosition);

    return () => {
      saveScrollPosition();
      unsubscribeBeforeNavigate();
      unlisten();
      window.removeEventListener('popstate', restoreScrollPosition);
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [router]);

  /**
   * ✅ Restore Scroll Position after Route Change
   */
  useLayoutEffect(() => {
    restoreScrollPosition();
  }, [router.state.location.pathname, router.state.location.search]);

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
