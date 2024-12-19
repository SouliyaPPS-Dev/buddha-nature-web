import SutraCard from '@/containers/sutra/SutraCard';
import React, { useEffect, useRef } from 'react';

interface SearchResult {
  ID: string; // Adjust the type of ID if necessary
  ຊື່ພຣະສູດ: string;
  ພຣະສູດ: string;
  ໝວດທັມ: string;
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsDropdownOpen]);

  return (
    isDropdownOpen &&
    searchResults?.length &&
    searchResults.length > 0 && (
      <div
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '40rem', // Adjust maximum width for larger screens
        }}
      >
        <ul
          id='dropdown'
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%', // Adjust width for smaller screens
            maxWidth: '40rem', // Max width for desktops
            zIndex: 50,
            marginTop: '0.5rem',
            maxHeight: '32rem',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            overflowX: 'hidden',
            border: '1px solid #e5e7eb',
          }}
        >
          {[...searchResults].reverse().map((result, index) => (
            <React.Fragment key={index}>
              <div className='mb-1'>
                <SutraCard
                  key={result.ID}
                  title={result['ຊື່ພຣະສູດ']}
                  detail={result['ພຣະສູດ']}
                  searchTerm={searchTerm}
                  onClick={() => handleResultClick(result)}
                  route={`/sutra/details/${result['ໝວດທັມ']}/${result['ຊື່ພຣະສູດ']}?search=${searchTerm}`}
                />
                {index < searchResults.length - 1 && (
                  <li className='h-pxmx-4' aria-hidden='true'></li>
                )}
              </div>
            </React.Fragment>
          ))}
        </ul>
      </div>
    )
  ) || null;
};

export default DropdownSearch;
