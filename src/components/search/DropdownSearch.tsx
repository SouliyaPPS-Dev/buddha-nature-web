import SutraCard from '@/containers/sutra/SutraCard';
import { router } from '@/router';
import React, { useEffect, useRef } from 'react';

interface SearchResult {
  ID: string;
  ຊື່ພຣະສູດ: string;
  ພຣະສູດ: string;
  ໝວດທັມ: string;
  ສຽງ: string;
}

interface DropdownProps {
  isDropdownOpen?: boolean;
  searchResults?: SearchResult[] | null;
  searchTerm?: string;
  handleResultClick: (result: SearchResult) => void;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentlyPlayingId?: string | null;
  handlePlayAudio: (id: string) => void;
  handleNextAudio: () => void;
}

const DropdownSearch: React.FC<DropdownProps> = ({
  isDropdownOpen,
  searchResults,
  searchTerm,
  handleResultClick,
  setIsDropdownOpen,
  currentlyPlayingId,
  handlePlayAudio,
  handleNextAudio,
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

  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      dropdownRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isDropdownOpen]);

  if (!isDropdownOpen || !searchResults?.length) return null;

  return (
    <div
      ref={dropdownRef}
      className={`dropdown-container transition-all duration-300 ease-in-out ${
        isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: '40rem',
      }}
    >
      <ul
        className='dropdown-list'
        style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '40rem',
          zIndex: 50,
          marginTop: '0.5rem',
          maxHeight: '32rem',
          borderRadius: '0.375rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',
          background: 'theme.default',
        }}
      >
        {searchResults
          .slice()
          .reverse()
          .map((result) => (
            <li key={result.ID} className='mb-1 bg-paper'>
              <SutraCard
                title={result['ຊື່ພຣະສູດ']}
                detail={result['ພຣະສູດ']}
                audio={result['ສຽງ']}
                searchTerm={searchTerm}
                onClick={() => {
                  router.navigate({
                    to: `/sutra/details/${result['ໝວດທັມ']}/${result['ຊື່ພຣະສູດ']}${window.location.search}`,
                  });
                  handleResultClick(result);
                }}
                route={`/sutra/details/${result['ໝວດທັມ']}/${result['ຊື່ພຣະສູດ']}${window.location.search}`}
                isPlaying={currentlyPlayingId === result.ID}
                onPlay={() => handlePlayAudio(result.ID)}
                onAudioEnd={handleNextAudio} // Move to next audio
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default React.memo(DropdownSearch);
