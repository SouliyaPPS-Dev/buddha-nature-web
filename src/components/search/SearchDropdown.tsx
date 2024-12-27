import { useSutra } from '@/hooks/sutra/useSutra';
import { Input } from '@nextui-org/react';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SearchIcon } from '../layouts/icons';
import { useMenuContext } from '../layouts/MenuProvider';
import DropdownSearch from './DropdownSearch';
import { useSearchContext } from './SearchContext';

export const SearchDropdown = () => {
  const { searchTerm, setSearchTerm } = useSearchContext();
  const {
    data: searchResults,
    isLoading,
    currentlyPlayingId,
    handlePlayAudio,
    handleNextAudio,
  } = useSutra();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setIsMenuOpen } = useMenuContext();

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mobile screens
  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      inputRef.current?.focus();
    }
  }, []);

  // Debounced Search Input Handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setIsDropdownOpen(value.trim().length > 0);
    }, 300),
    [setSearchTerm]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleResultClick = () => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <div className='relative w-full max-w-md'>
      <Input
        ref={inputRef}
        aria-label='Search'
        labelPlacement='outside'
        type='search'
        placeholder='ຄົ້ນຫາພຣະສູດທັງໝົດ...'
        className='text-base themes'
        startContent={
          <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
        }
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => searchTerm.trim().length > 0 && setIsDropdownOpen(true)}
      />

      <DropdownSearch
        isDropdownOpen={isDropdownOpen}
        searchResults={searchResults}
        searchTerm={searchTerm}
        handleResultClick={handleResultClick}
        setIsDropdownOpen={setIsDropdownOpen}
        currentlyPlayingId={currentlyPlayingId}
        handlePlayAudio={handlePlayAudio}
        handleNextAudio={handleNextAudio}
      />

      {/* No Results */}
      {isDropdownOpen && searchResults?.length === 0 && !isLoading && (
        <div className='absolute mt-2 w-full bg-white border rounded-md shadow-lg p-4 text-center text-gray-500'>
          No results found
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className='absolute mt-2 w-full bg-white border rounded-md shadow-lg p-4 text-center text-gray-500'>
          Loading...
        </div>
      )}
    </div>
  );
};
