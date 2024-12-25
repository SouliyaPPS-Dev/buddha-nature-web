import { useRouterState } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import smoothscroll from 'smoothscroll-polyfill';

export const useScrollingStore = () => {
     // Reference to the scroll container
     const scrollContainerRef = useRef<HTMLDivElement | null>(null);
     // Store scroll positions for each route
     const scrollPositions = useRef<Record<string, number>>({});
     const location = useRouterState({ select: (state) => state.location });

     // ✅ Enable smooth scroll polyfill (for better cross-browser support)
     useEffect(() => {
          smoothscroll.polyfill();
     }, []);

     // ✅ Save scroll position on route change
     useEffect(() => {
          const saveScrollPosition = () => {
               if (scrollContainerRef.current) {
                    scrollPositions.current[location.pathname] =
                         scrollContainerRef.current.scrollTop || window.scrollY;
               } else {
                    scrollPositions.current[location.pathname] = window.scrollY;
               }
          };

          window.addEventListener('beforeunload', saveScrollPosition);
          window.addEventListener('popstate', saveScrollPosition); // Handle back/forward navigation

          return () => {
               window.removeEventListener('beforeunload', saveScrollPosition);
               window.removeEventListener('popstate', saveScrollPosition);
          };
     }, [location.pathname]);

     // ✅ Restore scroll position on route change
     useEffect(() => {
          const restoreScrollPosition = () => {
               const savedPosition = scrollPositions.current[location.pathname];

               if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                         top: savedPosition ?? 0,
                         behavior: 'auto', // Direct jump to the position without animation
                    });
               } else {
                    window.scrollTo({
                         top: savedPosition ?? 0,
                         behavior: 'auto', // Direct jump to the position without animation
                    });
               }
          };

          // Ensure immediate restoration without delay
          requestAnimationFrame(restoreScrollPosition);
     }, [location.pathname]);

     // ✅ Save current scroll position before navigation (e.g., page unmount)
     useEffect(() => {
          return () => {
               if (scrollContainerRef.current) {
                    scrollPositions.current[location.pathname] =
                         scrollContainerRef.current.scrollTop || window.scrollY;
               } else {
                    scrollPositions.current[location.pathname] = window.scrollY;
               }
          };
     }, [location.pathname]);

     return {
          scrollContainerRef,
     };
};