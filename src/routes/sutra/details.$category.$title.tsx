/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFontSizeContext } from '@/components/FontSizeProvider';
import { useSearchContext } from '@/components/search/SearchContext';
import { useSutra } from '@/hooks/sutra/useSutra';
import { createFileRoute } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import ReactHtmlParser from 'react-html-parser';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const Route = createFileRoute('/sutra/details/$category/$title')({
  loader: async ({ params }) => {
    const { category, title } = params;
    return { category, title };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { category, title } = params;
  const { data } = useSutra();
  const { searchTerm } = useSearchContext();
  const { fontSize, setFontSize } = useFontSizeContext();

  // State for font size
  const itemsPerPage = 1; // Always show 1 item per "chunk"
  const [filteredDetails, setFilteredDetails] = useState<any[]>([]); // Filtered data displayed in the flipbook
  const [currentPage, setCurrentPage] = useState(0); // Current page index

  // Filter the initial set of data
  const initialFilteredDetails = useMemo(() => {
    return (
      data?.filter((item) => {
        if (
          !item ||
          !item['ຊື່ພຣະສູດ'] ||
          !item['ໝວດທັມ'] ||
          !title ||
          !category
        ) {
          return false;
        }
        return (
          item['ຊື່ພຣະສູດ'].toLowerCase() === title.toLowerCase() &&
          item['ໝວດທັມ'].toLowerCase() === category.toLowerCase()
        );
      }) || []
    );
  }, [data, title, category]);

  // Initialize `filteredDetails` with the first chunk of data
  useEffect(() => {
    if (initialFilteredDetails.length > 0) {
      setFilteredDetails(initialFilteredDetails.slice(0, itemsPerPage));
    }
  }, [initialFilteredDetails, itemsPerPage]);

  // Update `filteredDetails` whenever `category` or `title` changes
  useEffect(() => {
    const updatedDetails =
      data?.filter(
        (item) =>
          item['ຊື່ພຣະສູດ']?.toLowerCase() === title?.toLowerCase() &&
          item['ໝວດທັມ']?.toLowerCase() === category?.toLowerCase()
      ) || [];

    setFilteredDetails(updatedDetails.slice(0, itemsPerPage));
    setCurrentPage(0); // Reset to the first page
  }, [category, title, data]);

  // The reusable function to get the next chunk of data
  const getNextData = (
    latestIndex: number,
    itemsPerPage: number,
    fullData: any[]
  ): any[] => {
    if (latestIndex + 1 < fullData.length) {
      return fullData.slice(latestIndex + 1, latestIndex + 1 + itemsPerPage); // Get next `itemsPerPage` items
    }
    return []; // Return empty array if no data is left
  };

  // Navigate to the next page
  const goToNextPage = () => {
    setFilteredDetails((prev) =>
      prev.concat(getNextData(currentPage, itemsPerPage, data))
    );

    setCurrentPage((prev) => prev + itemsPerPage);
  };

  // Navigate to the previous page
  const goToPreviousPage = () => {
    setFilteredDetails((prev) => prev.slice(0, prev.length - itemsPerPage));
    setCurrentPage((prev) => prev - itemsPerPage);
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

  // Handlers for font size adjustments
  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32)); // Max 32px
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12)); // Min 12px

  const renderPositionBar = () => (
    <div
      style={{
        position: 'fixed', // Fixed at the bottom of the viewport
        bottom: '0', // Align to the bottom
        left: '0', // Full viewport width
        right: '0', // Full viewport width
        zIndex: 50, // Stay on top of other components
        padding: '1rem', // Vertical padding
        display: 'flex', // Flexbox layout
        justifyContent: 'space-between', // Balance the layout for left, center, and right items
        alignItems: 'center', // Vertically center all items
        marginBottom: '58px',
      }}
    >
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
            width: '25px', // Smaller width
            height: '25px', // Smaller height
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
        {/* Decrease Font Size Button */}
        <button
          onClick={decreaseFontSize}
          style={{
            borderRadius: '0.25rem',
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#fff',
            border: 'none',
            background: 'linear-gradient(135deg, #8B5E3C, #D4A054)',
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
          A-
        </button>

        {/* Increase Font Size Button */}
        <button
          onClick={increaseFontSize}
          style={{
            borderRadius: '0.25rem',
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#fff',
            border: 'none',
            background: 'linear-gradient(135deg, #5E412D, #8B5E3C)',
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
          A+
        </button>
      </div>
      {/* Next Page Button (Right Side) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={goToNextPage}
          style={{
            display: 'flex', // Use flexbox for alignment
            alignItems: 'center',
            justifyContent: 'center',
            width: '25px', // Smaller width
            height: '25px', // Smaller height
            borderRadius: '15px', // Fully rounded button
            border: 'none',
            background: '#8B5E3C', // Active brown
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#704214'; // Darker hover color
            e.currentTarget.style.transform = 'scale(1.1)'; // Slight zoom
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#8B5E3C'; // Reset color
            e.currentTarget.style.transform = 'scale(1)'; // Reset zoom
          }}
        >
          <FaChevronRight size={18} /> {/* Chevron Right Icon */}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className='relative flex justify-center items-center mb-24'>
        {/* Content of the Current Page */}
        {filteredDetails.length ? (
          <div
            className='page cursor-text mb-8'
            contentEditable={true}
            style={{ fontSize: `${fontSize}px` }}
          >
            {/* ຊື່ພຣະສູດ */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <Highlighter
                highlightClassName='bg-yellow-200 font-bold'
                searchWords={[searchTerm || '']}
                autoEscape={true}
                textToHighlight={filteredDetails[currentPage]['ຊື່ພຣະສູດ']}
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
              {filteredDetails[currentPage]['ສຽງ'] !== '/' && (
                <audio controls>
                  <source
                    src={filteredDetails[currentPage]['ສຽງ']}
                    type='audio/mpeg'
                  />
                </audio>
              )}
            </div>

            {/* Render ພຣະສູດ */}
            {renderDetail(filteredDetails[currentPage]['ພຣະສູດ'], searchTerm)}
            <br />

            {/* Render ໝວດທັມ */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <Highlighter
                highlightClassName='bg-yellow-200 font-bold' // Highlight class
                searchWords={[searchTerm || '']} // Highlight based on searchTerm
                autoEscape={true} // Allow Auto Escape for search term
                textToHighlight={filteredDetails[currentPage]['ໝວດທັມ']} // Text to highlight
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
        ) : (
          <p>No content available</p>
        )}
      </div>

      {/* Navigation Controls */}
      {renderPositionBar()}
    </>
  );
}
