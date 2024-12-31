import { router } from '@/router';
import { useRouterState } from '@tanstack/react-router';
import { createContext, useContext, useEffect, useState } from 'react';

type NavigationContextType = {
  history: string[];
  back: () => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

// Key to store history in localStorage
const HISTORY_STORAGE_KEY = 'navigation_history';

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<string[]>(() => {
    // Load initial history from localStorage if available
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const location = useRouterState({ select: (state) => state.location });

  useEffect(() => {
    const currentPath = location.pathname;

    setHistory((prev) => {
      const lastPath = prev[prev.length - 1];
      if (lastPath === currentPath) return prev; // Avoid duplicates

      const updatedHistory = [...prev, currentPath];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory)); // Persist to localStorage
      return updatedHistory;
    });

    // Handle back/forward browser navigation
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      setHistory((prev) => {
        if (prev[prev.length - 1] === currentPath) return prev;
        const updatedHistory = [...prev, currentPath];
        localStorage.setItem(
          HISTORY_STORAGE_KEY,
          JSON.stringify(updatedHistory)
        ); // Persist to localStorage
        return updatedHistory;
      });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  const back = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousPath = history[history.length - 2];

      setHistory(newHistory);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory)); // Update localStorage

      if (previousPath) {
        router.navigate({ to: previousPath });
        return;
      }
    }

    // Fallback to the root route
    router.navigate({ to: '/' });
  };

  return (
    <NavigationContext.Provider value={{ history, back }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
