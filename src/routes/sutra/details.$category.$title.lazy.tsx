/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFontSizeContext } from '@/components/FontSizeProvider';
import { useSearchContext } from '@/components/search/SearchContext';
import { useSutra } from '@/hooks/sutra/useSutra';
import { createLazyFileRoute } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import ReactHtmlParser from 'react-html-parser';
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';
import { GrCopy } from 'react-icons/gr';
import { IoShareSocialSharp } from 'react-icons/io5';

export const Route = createLazyFileRoute('/sutra/details/$category/$title')({
  component: () => <RouteComponent />,
});

function RouteComponent() {
  const params = Route.useParams();
  const { category, title } = params;
  const { data } = useSutra();
  const { searchTerm } = useSearchContext();
  const { fontSize, setFontSize } = useFontSizeContext();

  // Inside your component
  const [isCopied, setIsCopied] = useState(false); // State to manage copy success

  // State for font size
  const itemsPerPage = 1; // Always show 1 item per "chunk"
  const [filteredDetails, setFilteredDetails] = useState<any[]>([]); // Filtered data displayed in the flipbook
  const [currentPage, setCurrentPage] = useState(0); // Current page index

  // Find current index in the original data array
  const currentGlobalIndex = data?.findIndex(
    (item) => item.ID === filteredDetails?.[currentPage]?.ID
  ); // Assuming `ID` is the unique identifier

  // **Filter Data Based on Search Term or Category/Title**
  const getFilteredData = useCallback(() => {
    if (!data) return [];

    const normalizedSearchTerm =
      typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';

    if (normalizedSearchTerm !== '') {
      return data.filter((item) =>
        [item['ຊື່ພຣະສູດ'], item['ພຣະສູດ'], item['ໝວດທັມ']]
          .join('')
          .toLowerCase()
          .includes(normalizedSearchTerm)
      );
    } else {
      // If there's no search term, filter based on category and title
      return data.filter(
        (item) =>
          item['ຊື່ພຣະສູດ']?.toLowerCase() === title?.toLowerCase() &&
          item['ໝວດທັມ']?.toLowerCase() === category?.toLowerCase()
      );
    }
  }, [data, searchTerm, category, title]);

  const isDisabled = getFilteredData().length < 1;
  const isDisabledEmptySearch =
    getFilteredData().length <= filteredDetails.length;

  // Initialize filteredDetails with the first chunk of data
  useEffect(() => {
    if (getFilteredData().length) {
      setFilteredDetails(getFilteredData().slice(0, itemsPerPage));
    }
  }, [getFilteredData, itemsPerPage]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredDetails(getFilteredData().slice(0, itemsPerPage));
    } else {
      setFilteredDetails(getFilteredData());
    }
  }, [searchTerm]);

  useEffect(() => {
    // Filter data based on category and title
    const updatedDetails = data.filter(
      (item) =>
        item['ຊື່ພຣະສູດ']?.toLowerCase() === title?.toLowerCase() &&
        item['ໝວດທັມ']?.toLowerCase() === category?.toLowerCase()
    );
    if (updatedDetails.length > 0) {
      setFilteredDetails(updatedDetails.slice(0, itemsPerPage));
    } else {
      setFilteredDetails([]);
    }
  }, [data, category, title]);

  // The reusable function to get the next chunk of data
  const getNextData = (
    latestIndex: number,
    itemsPerPage: number,
    filteredData: any[]
  ): any[] => {
    if (latestIndex + 1 < filteredData.length) {
      return filteredData.slice(
        latestIndex + 1,
        latestIndex + 1 + itemsPerPage
      ); // Get next `itemsPerPage` items
    }

    if (searchTerm !== '') {
      return filteredData.slice(0, itemsPerPage);
    }
    return []; // Return empty array if no data is left
  };

  // Navigate to the next page
  const goToNextPage = () => {
    if (currentPage < filteredDetails.length - 1) {
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
      }, 600); // Match duration of animation
    }

    setFilteredDetails((prev) =>
      prev.concat(getNextData(currentGlobalIndex, itemsPerPage, data))
    );

    // Increment the current page to load the next batch of data
    setCurrentPage((prev) => prev + itemsPerPage);
  };

  // Navigate to the previous page
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
      }, 600);
    }

    setFilteredDetails((prev) => prev.slice(0, prev.length - itemsPerPage));
    setCurrentPage((prev) => prev - itemsPerPage);
  };

  // Handlers for font size adjustments
  const increaseFontSize = () =>
    setFontSize((prev) => (prev < 32 ? prev + 2 : prev)); // Max 32px

  const decreaseFontSize = () =>
    setFontSize((prev) => (prev > 12 ? prev - 2 : prev)); // Min 12px

  // **Copy to Clipboard Handler**
  const copyToClipboard = () => {
    if (filteredDetails.length) {
      const currentItem = filteredDetails[currentPage];
      const textToCopy = `
       ${currentItem['ຊື່ພຣະສູດ']}
       ${currentItem['ພຣະສູດ']}
       ${currentItem['ໝວດທັມ']}
    `.trim(); // Using trim() to remove extra leading/trailing whitespace or newlines

      navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true); // Set the state to true (show success icon)
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      });
    }
  };

  const handleShare = async () => {
    const text = filteredDetails[currentPage]['ຊື່ພຣະສູດ'];
    const url = `${window.location.origin}/sutra/details/${category}/${title}${window.location.search}`;

    // Sharing the content using the Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          text, // Shared text with category
          url, // Share a link to the content (the page with the HTML)
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Sharing is not supported on this device.');
    }
  };

  // Function to sanitize and parse HTML content
  const renderDetail = (htmlContent: string, searchTerm?: string) => {
    const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
    const contentWithBreaks = sanitizedHtmlContent.replace(/\n/g, '<br/>');

    if (!searchTerm?.trim()) {
      return (
        <div
          contentEditable={true}
          style={{ fontSize: `${fontSize}px` }}
          className='cursor-text'
        >
          {ReactHtmlParser(contentWithBreaks)}
        </div>
      );
    } else {
      // Highlighting functionality if searchTerm is provided
      const parts = contentWithBreaks.split(
        new RegExp(`(${searchTerm})`, 'gi')
      );
      return parts.map((part, index) => {
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          return (
            <span
              key={index}
              className='bg-yellow-200 font-bold text-black cursor-text'
              contentEditable={true}
              style={{ fontSize: `${fontSize}px` }}
            >
              {ReactHtmlParser(part)}
            </span>
          );
        }
        return <span key={index}>{ReactHtmlParser(part)}</span>;
      });
    }
  };

  const renderPositionBar = () => (
    <div className='fixed bottom-0 left-0 right-0 z-10 px-4 py-4 flex justify-between items-center md:mb-[64px] mb-5 text-white'>
      {/* Previous Page Button (Left Side) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          style={{
            display: 'flex', // Use flexbox for alignment
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '15px', // Fully rounded button
            border: 'none',
            background: currentPage === 0 ? '#E0E0E0' : '#8B5E3C', // Gray for disabled, brown for active
            color: currentPage === 0 ? '#999' : '#fff', // Indicate disabled state
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer', // Disable interaction if not clickable
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)', // Subtle shadow for depth
            transition: 'all 0.3s ease', // Smooth transitions for hover and other changes
          }}
          onMouseOver={(e) => {
            if (currentPage !== 0) {
              e.currentTarget.style.background = '#704214'; // Darker brown hover effect
              e.currentTarget.style.transform = 'scale(1.1)'; // Slight zoom effect
            }
          }}
          onMouseOut={(e) => {
            if (currentPage !== 0) {
              e.currentTarget.style.background = '#8B5E3C'; // Reset color
              e.currentTarget.style.transform = 'scale(1)'; // Reset zoom
            }
          }}
        >
          <FaChevronLeft size={18} /> {/* Chevron Left Icon */}
        </button>
      </div>
      {/* Font Size Controls (Center) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center', // Center the font size controls
          gap: '1rem', // Add spacing between A- and A+
          alignItems: 'center',
        }}
      >
        {/* Copy to Clipboard Button */}
        <button
          onClick={copyToClipboard}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #5E412D, #8B5E3C)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseOver={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1.05)', // Enlarge slightly on hover
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)', // Enhanced shadow
            })
          }
          onMouseOut={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1)', // Reset scale
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Reset shadow
            })
          }
        >
          {isCopied ? (
            <FaCheck size={18} color='green' />
          ) : (
            <GrCopy size={18} />
          )}
        </button>

        {/* Decrease Font Size Button */}
        <button
          onClick={decreaseFontSize}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #8B5E3C, #D4A054)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1.05)', // Enlarge slightly on hover
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)', // Enhanced shadow
            })
          }
          onMouseOut={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1)', // Reset scale
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Reset shadow
            })
          }
        >
          <FaMinus size={20} />
        </button>

        {/* Increase Font Size Button */}
        <button
          onClick={increaseFontSize}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #5E412D, #8B5E3C)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1.05)', // Enlarge slightly on hover
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)', // Enhanced shadow
            })
          }
          onMouseOut={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1)', // Reset scale
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Reset shadow
            })
          }
        >
          <FaPlus size={20} />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #5E412D, #8B5E3C)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1.05)', // Enlarge slightly on hover
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)', // Enhanced shadow
            })
          }
          onMouseOut={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1)', // Reset scale
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Reset shadow
            })
          }
        >
          <IoShareSocialSharp size={20} /> {/* Share Icon */}
        </button>
      </div>

      {/* Next Page Button (Right Side) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {searchTerm === '' && (
          <button
            onClick={goToNextPage}
            disabled={isDisabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: isDisabled ? '#E0E0E0' : '#8B5E3C',
              color: isDisabled ? '#999' : '#fff',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.background = '#704214';
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseOut={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.background = '#8B5E3C';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <FaChevronRight size={18} /> {/* Chevron Right Icon */}
          </button>
        )}

        {searchTerm !== '' && (
          <button
            onClick={goToNextPage}
            disabled={isDisabledEmptySearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: isDisabledEmptySearch ? '#E0E0E0' : '#8B5E3C',
              color: isDisabledEmptySearch ? '#999' : '#fff',
              cursor: isDisabledEmptySearch ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              if (!isDisabledEmptySearch) {
                e.currentTarget.style.background = '#704214';
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseOut={(e) => {
              if (!isDisabledEmptySearch) {
                e.currentTarget.style.background = '#8B5E3C';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <FaChevronRight size={18} /> {/* Chevron Right Icon */}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className='relative flex justify-center items-center mb-24 mt-4 px-3'>
        {/* Content of the Current Page Flipbook Animation */}
        {filteredDetails?.length > 0 ? (
          <>
            <motion.div
              className='page cursor-text mb-8'
              style={{
                fontSize: `${fontSize}px`,
                perspective: '1000px', // Perspective for flip effect
                position: 'relative', // Ensure stacking context for shadow effect
              }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
              drag='x' // Enable dragging only on the x-axis
              dragConstraints={{ left: 0, right: 0 }} // Limit drag direction
              onDragStart={(event) => {
                // Prevent scrolling during horizontal drag
                event.stopPropagation();
              }}
              onDragEnd={(_event, info) => {
                if (info.offset.x < -100) {
                  goToNextPage(); // Go to the next page on left swipe
                } else if (info.offset.x > 100 && currentPage > 0) {
                  goToPreviousPage(); // Go to the previous page on right swipe
                }
              }}
            >
              <div contentEditable={true}>
                {/* ຊື່ພຣະສູດ */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <Highlighter
                    highlightClassName='bg-yellow-200 font-bold'
                    searchWords={[searchTerm || '']}
                    autoEscape={true}
                    textToHighlight={
                      filteredDetails?.[currentPage]?.['ຊື່ພຣະສູດ']
                    }
                    style={{ fontSize: '20px' }}
                  />
                </div>

                {/* ສຽງ */}
                <div
                  style={{
                    display: 'flex', // Use flexbox
                    justifyContent: 'center', // Center horizontally
                    alignItems: 'center', // Center vertically (optional, if needed)
                    marginBottom: '1rem', // Match the original `mb-4` equivalent in Tailwind (1rem = 16px)
                  }}
                >
                  {filteredDetails?.[currentPage]?.['ສຽງ'] !== '/' && (
                    <audio controls>
                      <source
                        src={filteredDetails?.[currentPage]?.['ສຽງ']}
                        type='audio/mpeg'
                      />
                    </audio>
                  )}
                </div>

                {/* Render ພຣະສູດ */}
                {renderDetail(
                  filteredDetails?.[currentPage]?.['ພຣະສູດ'],
                  searchTerm
                )}
                <br />

                {/* Render ໝວດທັມ */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <Highlighter
                    highlightClassName='bg-yellow-200 font-bold' // Highlight class
                    searchWords={[searchTerm || '']} // Highlight based on searchTerm
                    autoEscape={true} // Allow Auto Escape for search term
                    textToHighlight={filteredDetails?.[currentPage]?.['ໝວດທັມ']} // Text to highlight
                    style={{
                      fontSize: '20px', // Font size
                      textAlign: 'center', // Ensure text alignment inside Highlighter
                      display: 'inline-block', // Ensure it does not take full width
                      fontStyle: 'italic',
                      color: '#888',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className='text-center'>No content available</div>
        )}
      </div>

      {/* Navigation Controls */}
      {renderPositionBar()}
    </>
  );
}
