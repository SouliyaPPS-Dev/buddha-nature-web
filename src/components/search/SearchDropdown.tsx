/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSutra } from '@/hooks/sutra/useSutra';
import { Input } from '@nextui-org/react'; // Assuming you're using the Next.js UI framework
import React, { useState } from 'react';
import { SearchIcon } from '../layouts/icons';
import { useMenuContext } from '../layouts/MenuProvider';
import DropdownSearch from './DropdownSearch';
import { useSearchContext } from './SearchContext';

export const SearchDropdown = () => {
  const { searchTerm, setSearchTerm } = useSearchContext();
  const {
    data: searchResults,
    isLoading, // Audio
    currentlyPlayingId,
    handlePlayAudio,
  } = useSutra();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controls dropdown visibility
  const { setIsMenuOpen } = useMenuContext(); // Use the context

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // Update search term
    setIsDropdownOpen(value.trim().length > 0); // Open dropdown only if input has valid text
  };

  const handleResultClick = () => {
    setIsDropdownOpen(false); // Close dropdown on selection
    setIsMenuOpen(false);
  };

  //  Container for search and dropdown
  return (
    <div className='relative w-full max-w-md'>
      {/* Search Input */}
      <Input
        aria-label='Search'
        labelPlacement='outside'
        type='search'
        placeholder='ຄົ້ນຫາພຣະສູດທັງໝົດ...'
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm',
        }}
        startContent={
          <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
        }
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => searchTerm.trim().length > 0 && setIsDropdownOpen(true)} // Prevent opening empty dropdown on focus
      />

      {/* Search Results Dropdown */}
      <DropdownSearch
        isDropdownOpen={isDropdownOpen}
        searchResults={searchResults}
        searchTerm={searchTerm}
        handleResultClick={handleResultClick}
        setIsDropdownOpen={setIsDropdownOpen}
        currentlyPlayingId={currentlyPlayingId}
        handlePlayAudio={handlePlayAudio}
      />

      {/* No Results Message */}
      {isDropdownOpen && searchResults?.length === 0 && (
        <div className='absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500'>
          No results found
        </div>
      )}
      {/* Loading Spinner */}
      {isLoading && (
        <div className='absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500'>
          Loading...
        </div>
      )}
    </div>
  );
};
