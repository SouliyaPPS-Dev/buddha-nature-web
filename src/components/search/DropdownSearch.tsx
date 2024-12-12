import SutraCard from '@/containers/sutra/SutraCard';
import React, { useEffect, useRef } from 'react';

interface SearchResult {
  ID: string; // Adjust the type of ID if necessary
  ຊື່ພຣະສູດ: string;
  ພຣະສູດ: string;
}

interface DropdownProps {
  isDropdownOpen?: boolean;
  searchResults?: SearchResult[] | null; // Array of search results or null if no results
  searchTerm?: string;
  handleResultClick: (result: SearchResult) => void; // Function that handles the click on a result
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownSearch: React.FC<DropdownProps> = ({
  isDropdownOpen,
  searchResults,
  searchTerm,
  handleResultClick,
  setIsDropdownOpen,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Function to handle click outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.getElementById('dropdown'); // Dropdown element ID
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        // Clear the search term if clicked outside
        const searchInput = document.getElementById(
          'search-input'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.value = '';
        }
      }
    };

    // Attach event listener to detect click outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Function to handle click outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Clicked outside, perform your desired action (e.g., close dropdown)
        setIsDropdownOpen(false);
      }
    };

    // Add event listener to detect click outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsDropdownOpen]);

  return (
    isDropdownOpen &&
    searchResults?.length &&
    searchResults.length > 0 && (
      <div
        ref={dropdownRef} // Attach the ref to the dropdown
        onClick={(e) => e.stopPropagation()} // Prevent click event from closing dropdown
      >
        <ul
          id='dropdown'
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '21rem', // Default width for larger screens
            maxWidth: '100%', // Make it responsive
            zIndex: 50,
            marginTop: '0.5rem',
            maxHeight: '32rem',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            overflowX: 'auto',
            border: '1px solid #e5e7eb',
          }}
        >
          {[...searchResults].reverse().map((result, index) => (
            <React.Fragment key={index}>
              <SutraCard
                key={result.ID}
                title={result['ຊື່ພຣະສູດ']}
                detail={result['ພຣະສູດ']}
                searchTerm={searchTerm}
                onClick={() => handleResultClick(result)}
              />
              {index < searchResults.length - 1 && (
                <li className='h-px bg-gray-200 mx-4' aria-hidden='true'></li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    )
  );
};

export default DropdownSearch;
