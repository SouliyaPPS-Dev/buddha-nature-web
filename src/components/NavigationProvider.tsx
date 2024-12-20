import { router } from '@/router';
import { useRouterState } from '@tanstack/react-router';
import { createContext, useContext, useEffect, useState } from 'react';

type NavigationContextType = {
  history: string[];
  back: () => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<string[]>([]);

  let location;
  try {
    const routerState = useRouterState({ select: (state) => state });
    location = routerState.location;
  } catch (error) {
    console.error('useRouterState must be used within RouterProvider');
    location = null;
  }

  useEffect(() => {
    const currentPath = window.location.pathname;

    setHistory((prev) => {
      const lastPath = prev[prev.length - 1];
      if (lastPath === currentPath) return prev; // Avoid duplicates
      return [...prev, currentPath];
    });

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      setHistory((prev) => {
        if (prev[prev.length - 1] === currentPath) return prev;
        return [...prev, currentPath];
      });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location?.pathname]);

  const back = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);

      const previousPath = history[history.length - 2];
      if (previousPath) {
        router.navigate({ to: previousPath });
        return;
      }
    }

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
