/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSutra } from '@/hooks/sutra/useSutra';
import { Input } from '@nextui-org/react'; // Assuming you're using the Next.js UI framework
import React, { useState } from 'react';
import { SearchIcon } from './icons';
import { useSearch } from './SearchContext';

export const SearchDropdown = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const { data: searchResults, isLoading } = useSutra();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controls dropdown visibility

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // Update search term
    setIsDropdownOpen(value.trim().length > 0); // Open dropdown only if input has valid text
  };

  const handleResultClick = () => {
    setIsDropdownOpen(false); // Close dropdown on selection
    setSearchTerm(''); // Reset search if necessary
  };

  //  Container for search and dropdown
  return (
    <div className='relative w-full max-w-md'>
      {/* Search Input */}
      <Input
        aria-label='Search'
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm',
        }}
        labelPlacement='outside'
        placeholder='ຄົ້ນຫາພຣະສູດທັງໝົດ...'
        startContent={
          <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
        }
        type='search'
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => searchTerm.trim().length > 0 && setIsDropdownOpen(true)} // Prevent opening empty dropdown on focus
      />

      {/* Search Results Dropdown */}
      {isDropdownOpen && searchResults?.length > 0 && (
        <ul className='absolute z-50 mt-2 w-full max-h-60 rounded-md shadow-lg overflow-y-auto bg-white border border-gray-200'>
          {[...searchResults] // Create a copy of searchResults before reversing
            .reverse()
            .map((result: any, index: number) => (
              <React.Fragment key={index}>
                <li
                  onClick={() => handleResultClick()}
                  className='cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between'
                >
                  {/* Flexible List Item */}
                  <div className='flex flex-col'>
                    <span className='font-medium text-gray-800'>
                      {result['ຊື່ພຣະສູດ']}
                    </span>
                  </div>
                </li>

                {/* Divider */}
                {index < searchResults.length - 1 && (
                  <li className='h-px bg-gray-200 mx-4' aria-hidden='true'></li>
                )}
              </React.Fragment>
            ))}
        </ul>
      )}

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
