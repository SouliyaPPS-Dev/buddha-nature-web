/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSutra } from '@/hooks/sutra/useSutra';
import { createFileRoute } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const Route = createFileRoute('/sutra/details/$category/$title')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { category, title } = params;
  const { data } = useSutra();

  // State for font size
  const [fontSize, setFontSize] = useState(18); // Default font size is 18px
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const [itemsPerPage] = useState(5); // Number of pages to display per pagination "chunk"
  const [filteredDetails, setFilteredDetails] = useState<any[]>([]); // Filtered data displayed in the flipbook

  // Find current index in the original data array
  const currentGlobalIndex = data?.findIndex(
    (item) => item.ID === filteredDetails?.[currentPage]?.ID
  ); // Assuming `ID` is the unique identifier

  // Initial filter logic to load all matching data (filtered by category and title)
  const initialFilteredDetails =
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
    }) || [];

  // Effect to set the initial chunk of filtered data
  useEffect(() => {
    if (initialFilteredDetails.length > 0) {
      setFilteredDetails(initialFilteredDetails.slice(0, itemsPerPage)); // Load the first chunk
    }
  }, [initialFilteredDetails, itemsPerPage]); // Re-run if initialFilteredDetails or itemsPerPage changes

  // Function to load more data when reaching the end of the current filteredDetails
  const loadMoreData = () => {
    const newStartIndex = filteredDetails.length; // Start after currently displayed data
    const newDataChunk = initialFilteredDetails.slice(
      newStartIndex,
      newStartIndex + itemsPerPage
    ); // Get the next set of items
    if (newDataChunk.length > 0) {
      setFilteredDetails((prevDetails) => [...prevDetails, ...newDataChunk]); // Add new data to current filteredDetails
    }
  };

  // Handlers to navigate between pages
  const goToNextPage = () => {
    if (currentPage < filteredDetails.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else if (currentPage === filteredDetails.length - 1) {
      // Load new data if on the last page
      loadMoreData();
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
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
    }

    // Highlighting functionality if searchTerm is provided
    const parts = contentWithBreaks.split(new RegExp(`(${searchTerm})`, 'gi'));
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
  };

  // Handlers for font size adjustments
  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32)); // Max 32px
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12)); // Min 12px

  return (
    <>
      <div className='relative'>
        {/* Show current page position */}
        {filteredDetails.length > 0 && (
          <div className='text-center font-medium mb-4'>
            {currentGlobalIndex + 1} of {data?.length || 0}
          </div>
        )}

        {/* Content of the Current Page */}
        {filteredDetails && filteredDetails.length > 0 ? (
          <div
            className='page cursor-text mb-8'
            contentEditable={true}
            style={{ fontSize: `${fontSize}px` }}
          >
            <h2 className='text-2xl font-bold mb-4 text-center'>
              {filteredDetails[currentPage]['ຊື່ພຣະສູດ']}
            </h2>
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
            {/* Render content */}
            {renderDetail(filteredDetails[currentPage]['ພຣະສູດ'], '')}
            <p
              style={{ fontStyle: 'italic', color: '#888' }}
              className='text-center'
            >
              {filteredDetails[currentPage]['ໝວດທັມ']}
            </p>
          </div>
        ) : (
          <p>No content available</p>
        )}
      </div>

      {/* Navigation Controls */}
      <div
        style={{
          position: 'sticky', // Sticky position
          bottom: '4rem',
          left: '50px',
          right: '5rem',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <button
          onClick={goToPreviousPage}
          style={{
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            color: currentPage === 0 ? '#ccc' : 'white',
            background: currentPage === 0 ? 'gray' : '#a35709',
            border: 'none',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
          }}
          disabled={currentPage === 0}
        >
          <FaChevronLeft size={20} /> {/* Chevron left icon with 20px size */}
        </button>

        <button
          onClick={goToNextPage}
          style={{
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            color:
              currentPage === filteredDetails.length - 1 &&
              initialFilteredDetails.length === filteredDetails.length
                ? '#ccc'
                : 'white',
            background:
              currentPage === filteredDetails.length - 1 &&
              initialFilteredDetails.length === filteredDetails.length
                ? 'gray'
                : '#704214',
            border: 'none',
            cursor:
              currentPage === filteredDetails.length - 1 &&
              initialFilteredDetails.length === filteredDetails.length
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          <FaChevronRight size={20} /> {/* Chevron right icon with 20px size */}
        </button>
      </div>

      {/* Sticky Font Size Controls */}
      <div
        style={{
          position: 'sticky', // sticky position
          bottom: '4rem', // position 4rem from the bottom
          left: '50px', // position 50px from the left
          right: '5rem', // position 5rem from the right
          padding: '1rem', // padding for the container
          display: 'flex', // flexbox container
          justifyContent: 'center', // align buttons to the right
          gap: '0.5rem', // spacing between buttons
          zIndex: 50, // ensure it stays on top of other elements
        }}
      >
        <button
          onClick={decreaseFontSize}
          style={{
            borderRadius: '0.5rem', // Rounded button corners
            padding: '0.5rem 1rem', // Larger padding for better touch targets
            fontSize: '1rem', // Bigger, readable font size
            fontWeight: 'bold', // Bold font for emphasis
            color: 'white', // White text color
            border: 'none', // Remove default borders
            background: 'linear-gradient(135deg, #a35709, #d49a30)', // Saffron and gold gradient
            cursor: 'pointer', // Pointer cursor for interactivity
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
            transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Smooth animations
          }}
          onMouseOver={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1.05)', // Slightly enlarge button on hover
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)', // Enhance shadow on hover
            })
          }
          onMouseOut={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1)', // Reset scale
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Reset shadow
            })
          }
        >
          A-
        </button>
        <button
          onClick={increaseFontSize}
          style={{
            borderRadius: '0.5rem', // Rounded button corners
            padding: '0.5rem 1rem', // Larger padding for better touch targets
            fontSize: '1rem', // Bigger, readable font size
            fontWeight: 'bold', // Bold font for emphasis
            color: 'white', // White text color
            border: 'none', // Remove default borders
            background: 'linear-gradient(135deg, #704214, #a35709)', // Earthy brown gradient
            cursor: 'pointer', // Pointer cursor for interactivity
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
            transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Smooth animations
          }}
          onMouseOver={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1.05)', // Slightly enlarge button on hover
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)', // Enhance shadow on hover
            })
          }
          onMouseOut={(e) =>
            Object.assign(e.currentTarget.style, {
              transform: 'scale(1)', // Reset scale
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Reset shadow
            })
          }
        >
          A+
        </button>
      </div>
    </>
  );
}
