import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
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

  // Sync the `searchTerm` with the URL query parameter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentSearch = searchParams.search || '';
      const trimmedSearchTerm = searchTerm.trim();

      // Avoid unnecessary `router.navigate` calls
      if (currentSearch !== trimmedSearchTerm) {
        router.navigate({
          search: searchTerm ? { search: searchTerm } : {},
          replace: true,
        } as any);
      }
    }, 300); // Debounce update by 300ms

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [searchTerm, searchParams.search]);

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
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
