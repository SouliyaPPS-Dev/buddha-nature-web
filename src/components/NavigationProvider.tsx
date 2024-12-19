import { router } from '@/router';
import { useRouterState } from '@tanstack/react-router';
import { createContext, useContext, useEffect, useState } from 'react';

const NavigationContext = createContext<{
  history: string[];
  back: () => void;
} | null>(null);

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<string[]>([]);

  // Ensure the router state is only accessed when the router is active
  let location;
  try {
    const routerState = useRouterState({ select: (state) => state });
    location = routerState.location;
  } catch (error) {
    console.error('useRouterState must be used within RouterProvider');
    location = null;
  }

  useEffect(() => {
    if (location) {
      setHistory((prev) => [...prev, location.pathname]);
    }
  }, [location?.pathname]);

  const back = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);

      const previousPath = history[history.length - 2];
      if (previousPath) {
        router.navigate({ to: previousPath });
      }
    }
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
