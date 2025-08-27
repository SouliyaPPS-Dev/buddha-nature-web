import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useSearch } from '@tanstack/react-router'; // Ensure correct router import
import { router } from '@/router';

// Define the shape of the SearchContext
interface SearchContextType {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Safe default to prevent crashes if provider is missing
const DEFAULT_SEARCH_CONTEXT: SearchContextType = {
  searchTerm: '',
  setSearchTerm: () => {},
};

// SearchProvider: Provide the context to children components
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Obtain search parameters from the router
  const searchParams = useSearch<any>({ from: '__root__' });

  // State for the search term, initialized with the current query parameter
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.search || ''
  );

  // Debounced function to sync `searchTerm` with the URL query parameter
  const syncSearchTerm = useCallback(
    debounce((newSearchTerm) => {
      const currentSearch = searchParams.search || '';
      const trimmedSearchTerm = newSearchTerm.trim();

      // Avoid unnecessary `router.navigate` calls
      if (currentSearch !== trimmedSearchTerm) {
        router.navigate({
          search: newSearchTerm ? { search: newSearchTerm } : {},
          replace: true,
        } as any);
      }
    }, 300), // Debounce update by 300ms
    [searchParams.search]
  );

  // Sync the `searchTerm` with the URL query parameter
  useEffect(() => {
    syncSearchTerm(searchTerm);

    return () => syncSearchTerm.cancel(); // Cleanup on unmount
  }, [searchTerm, syncSearchTerm]);

  // Update the `searchTerm` when `searchParams.search` changes (to avoid desync)
  useEffect(() => {
    const currentSearch = searchParams.search || '';
    if (currentSearch !== searchTerm) {
      setSearchTerm(currentSearch);
    }
  }, [searchParams.search]);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({ searchTerm, setSearchTerm }),
    [searchTerm]
  );

  // Provide the context value to children
  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook to provide access to the context
export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    if (import.meta?.env?.DEV) {
      // In dev, warn to help diagnose missing provider placements
      // eslint-disable-next-line no-console
      console.warn('useSearchContext used outside of SearchProvider. Falling back to defaults.');
    }
    return DEFAULT_SEARCH_CONTEXT;
  }
  return context;
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  const debouncedFunction = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debouncedFunction.cancel = () => clearTimeout(timeout);
  return debouncedFunction;
}
