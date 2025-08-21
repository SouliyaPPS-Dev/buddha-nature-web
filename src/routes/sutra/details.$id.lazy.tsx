import AudioPlayerStyled from '@/components/AudioPlayer';
import { useFontSizeContext } from '@/components/FontSizeProvider';
import { useSearchContext } from '@/components/search/SearchContext';
import FavoriteButton from '@/containers/sutra/FavoriteButton';
import { useScrollingStore } from '@/hooks/ScrollProvider';
import { useSutra } from '@/hooks/sutra/useSutra';
import { SutraDataModel } from '@/model/sutra';
import { createLazyFileRoute } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'react-h5-audio-player/lib/styles.css';
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

export const Route = createLazyFileRoute('/sutra/details/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { scrollContainerRef } = useScrollingStore();
  const params = Route.useParams();
  const { id } = params;
  const { data } = useSutra();
  const { searchTerm } = useSearchContext();
  const { fontSize, setFontSize } = useFontSizeContext();
  const [isProcessing, setIsProcessing] = useState(false); // State to track if action is processing

  // Inside your component
  const [isCopied, setIsCopied] = useState(false); // State to manage copy success

  // State for font size
  const itemsPerPage = 1; // Always show 1 item per "chunk"
  const [filteredDetails, setFilteredDetails] = useState<any[]>([]); // Filtered data displayed in the flipbook
  const [currentPage, setCurrentPage] = useState(0); // Current page index

  const [isTextSelected, setIsTextSelected] = useState(false);

  // Function to check if text is selected
  const handleSelection = () => {
    const selection = window.getSelection();
    setIsTextSelected(
      selection && selection.toString().length > 0 ? true : false
    );
  };

  // Find current index in the original data array
  const currentGlobalIndex = data?.findIndex(
    (item) => item.ID === filteredDetails?.[currentPage]?.ID
  ); // Assuming `ID` is the unique identifier

  // Filter items based on category and search term
  const filteredItemsCategory = data?.filter((item: SutraDataModel) => {
    // Match category
    const matchesID = id ? item['ID'] === id : true;

    // Match search term in any field (case-insensitive)
    const matchesSearchTerm = searchTerm
      ? [item['ຊື່ພຣະສູດ'], item['ພຣະສູດ'], item['ໝວດທັມ']].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    return matchesID && matchesSearchTerm;
  });

  // **Filter Data Based on Search Term or Category/Title**
  const getFilteredData = useCallback(() => {
    if (!data) return [];

    const normalizedSearchTerm =
      typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';

    if (!searchTerm) {
      // If there's no search term, filter based on category and title
      return data.filter(
        (item) => item['ID']?.toLowerCase() === id?.toLowerCase()
      );
    }

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
        (item) => item['ID']?.toLowerCase() === id?.toLowerCase()
      );
    }
  }, [data, searchTerm, id]);

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
    const updatedDetails = data?.filter(
      (item) => item['ID']?.toLowerCase() === id?.toLowerCase()
    );
    if (updatedDetails.length > 0) {
      setFilteredDetails(updatedDetails.slice(0, itemsPerPage));
    } else {
      setFilteredDetails([]);
    }
  }, [data, id]);

  // The reusable function to get the next chunk of data
  const getNextData = (
    latestIndex: number,
    itemsPerPage: number,
    filteredData: any[]
  ): any[] => {
    if (latestIndex + itemsPerPage < filteredItemsCategory.length) {
      return filteredItemsCategory.slice(
        latestIndex + 1,
        latestIndex + 1 + itemsPerPage
      ); // Get next `itemsPerPage` items
    }

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
    if (isProcessing) return; // Prevent double clicks while processing
    setIsProcessing(true); // Lock the button after the first click
    if (currentPage >= 1) {
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsProcessing(false); // Unlock the button after processing
      }, 100);
    }

    setFilteredDetails((prev) => prev.slice(0, prev.length - itemsPerPage));
    setCurrentPage((prev) => prev - itemsPerPage);
  };

  const isPreviousDisabled = useMemo(
    () => filteredDetails.length <= 1 || isProcessing,
    [filteredDetails, isProcessing]
  );

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canNavigatePrevious =
        !isProcessing && currentPage > 0 && !isDisabled;

      if (e.key === 'ArrowLeft' && canNavigatePrevious) {
        goToPreviousPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // Dependency now relies on 'currentPage', 'filteredItemsCategory', 'isProcessing'
  }, [currentPage, filteredItemsCategory.length, isProcessing]);

  // Handlers for font size adjustments
  const increaseFontSize = () =>
    setFontSize((prev) => (prev < 32 ? prev + 2 : prev)); // Max 32px

  const decreaseFontSize = () =>
    setFontSize((prev) => (prev > 12 ? prev - 2 : prev)); // Min 12px

  // **Copy to Clipboard Handler**
  const copyToClipboard = () => {
    if (filteredDetails.length) {
      const currentItem = filteredDetails[currentPage];

      // Extract text while sanitizing unwanted <b> and <br> tags
      const textToCopy = `
      ${currentItem['ຊື່ພຣະສູດ']}
      ${currentItem['ພຣະສູດ']}
      ${currentItem['ໝວດທັມ']}
    `
        .replace(/<br\s*\/?>/gi, '') // Remove <br> and </br> tags
        .replace(/<\/?b>/gi, '') // Remove <b> and </b> tags
        .trim(); // Remove unnecessary whitespace or newlines

      navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true); // ✅ Show copied success message
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2s
      });
    }
  };

  const handleShare = async () => {
    const text = filteredDetails?.[currentPage]?.['ຊື່ພຣະສູດ'];
    const url = `${window.location.origin}/sutra/details/${filteredDetails?.[currentPage]?.['ID']}${window.location.search}`;

    // Sharing the content using the Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          url, // Share a link to the content (the page with the HTML)
          text,
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

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force blur every time the component renders
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 100); // Small delay ensures it runs after render
  }, []);

  const handleTouchOrClick = () => {
    if (contentRef.current) {
      contentRef.current.style.cursor = 'text'; // Ensure cursor blinks
      contentRef.current.blur(); // ✅ Immediately removes focus on click
    }
  };

  // Prevent text modifications while allowing selection
  const preventEditing = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault(); // Stops typing inside the div
  };

  const renderDetail = (htmlContent: string, searchTerm?: string) => {
    const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);

    return (
      <div
        ref={contentRef}
        onMouseDown={handleTouchOrClick} // Ensures cursor shows on click
        onTouchStart={handleTouchOrClick} // Fix for mobile (iOS/Android)
        onKeyDown={preventEditing} // Prevent typing inside div
        contentEditable='true' // ✅ Enables blinking cursor
        suppressContentEditableWarning={true} // Prevents React warnings
        style={{
          fontSize: `${fontSize}px`,
          cursor: 'text', // Ensure text cursor
          userSelect: 'text', // Allow text selection
          WebkitUserSelect: 'text', // ✅ Fix for iOS Safari
          touchAction: 'manipulation', // ✅ Improves mobile compatibility
          pointerEvents: 'auto', // Allow interactions
          wordBreak: 'break-word', // Prevents overflow
          whiteSpace: 'pre-wrap', // ✅ Ensures newlines (`\n`) show correctly
          outline: 'none', // Removes unwanted focus outline
          caretColor: 'black', // Ensures blinking cursor visibility
        }}
        className='relative rounded-md no-edit'
      >
        {searchTerm?.trim()
          ? sanitizedHtmlContent
              .split(new RegExp(`(${searchTerm})`, 'gi'))
              .map((part, index) =>
                part.toLowerCase() === searchTerm.toLowerCase() ? (
                  <span
                    key={index}
                    className='bg-yellow-200 font-bold text-black cursor-text'
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {ReactHtmlParser(part)}
                  </span>
                ) : (
                  <span key={index}>
                    {
                      // ✅ Convert `<br>Contents</br>` to Bold
                      ReactHtmlParser(
                        part
                          .replace(/<br>(.*?)<\/br>/gi, '<strong>$1</strong>') // Make text inside <br> bold
                          .replace(/\n/g, '<br />') // ✅ Convert `\n` to `<br>` for proper line breaks
                          .replace(/<br\s*\/?>/gi, '<br />') // Ensure all `<br>` tags are correctly formatted
                      )
                    }
                  </span>
                )
              )
          : sanitizedHtmlContent
              .split(/\n|<br\s*\/?>/gi) // ✅ Split on `\n` or `<br>` tags
              .map((line, index, arr) => (
                <span key={index}>
                  {
                    // ✅ Convert `<br>Contents</br>` into `<strong>Contents</strong>`
                    ReactHtmlParser(
                      line.replace(/<br>(.*?)<\/br>/gi, '<strong>$1</strong>')
                    )
                  }
                  {index !== arr.length - 1 && <br />}{' '}
                  {/* ✅ Preserve manual line breaks */}
                </span>
              ))}
      </div>
    );
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
          disabled={isPreviousDisabled} // Disable based on filteredDetails length and processing state
          style={{
            display: 'flex', // Use flexbox for alignment
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '15px', // Fully rounded button
            border: 'none',
            background: isPreviousDisabled ? '#E0E0E0' : '#8B5E3C', // Gray for disabled, brown for active
            color: isPreviousDisabled ? '#999' : '#fff', // Indicate disabled state
            cursor: isPreviousDisabled ? 'not-allowed' : 'pointer', // Disable interaction if not clickable
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)', // Subtle shadow for depth
            transition: 'all 0.3s ease', // Smooth transitions for hover and other changes
          }}
          onMouseOver={(e) => {
            if (filteredDetails.length > 1 && !isProcessing) {
              e.currentTarget.style.background = '#704214'; // Darker brown hover effect
              e.currentTarget.style.transform = 'scale(1.1)'; // Slight zoom effect
            }
          }}
          onMouseOut={(e) => {
            if (filteredDetails.length > 1 && !isProcessing) {
              e.currentTarget.style.background = '#8B5E3C'; // Reset color
              e.currentTarget.style.transform = 'scale(1)'; // Reset zoom
            }
          }}
        >
          <FaChevronLeft size={18} /> {/* Chevron Left Icon */}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center', // Center the font size controls
          gap: '1rem', // Add spacing between A- and A+
          alignItems: 'center',
        }}
      >
        {/* Font Size Controls (Center) */}
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

        {/* Button Favorite */}
        <FavoriteButton currentItem={filteredDetails?.[currentPage]} />

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
          <IoShareSocialSharp size={20} />
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
      <article>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>{filteredDetails?.[currentPage]?.['ຊື່ພຣະສູດ']}</title>
        <meta name='description' content='ຄຳສອນພຣະພຸດທະເຈົ້າ' />
        <meta
          name='keywords'
          content='Buddhaword, ຄຳສອນພຣະພຸດທະເຈົ້າ, ທັມມະ, ທັມມະຊາດ, lao, laos, the word of buddha, buddha, nature'
        />
        <link rel='manifest' href='/manifest.json' />

        <meta property='og:title' content='Buddhaword | ຄຳສອນພຣະພຸດທະເຈົ້າ' />
        <meta property='og:description' content='ຄຳສອນພຣະພຸດທະເຈົ້າ' />
        <meta
          property='og:image'
          content='https://buddha-nature.firebaseapp.comimages/logo_shared.png'
        />
        <meta property='og:type' content='website' />
        <meta
          property='og:url'
          content='https://buddha-nature.firebaseapp.com'
        />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Buddhaword' />
        <meta name='twitter:description' content='ຄຳສອນພຣະພຸດທະເຈົ້າ' />
        <meta
          name='twitter:image'
          content='https://buddha-nature.firebaseapp.comimages/logo_shared.png'
        />

        <link rel='icon' type='image/png' href='/images/logo_shared.png' />

        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='#FFAF5D' />
        <meta name='apple-mobile-web-app-title' content='Buddha-Nature' />
        <meta name='theme-color' content='#FFAF5D' />
        <link rel='apple-touch-icon' href='/images/logo_shared.png' />
      </article>

      {/* Flipbook Container */}
      <section
        ref={scrollContainerRef}
        className='relative flex justify-center items-center mb-24 mt-4 px-3'
      >
        {/* Content of the Current Page Flipbook Animation */}
        {filteredDetails?.length > 0 ? (
          <>
            <motion.div
              className='page cursor-text mb-8'
              style={{
                fontSize: `${fontSize}px`,
                perspective: '1000px', // Perspective for flip effect
                position: 'relative',
              }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
              drag={isTextSelected ? false : 'x'} // ❌ Disable swipe when text is selected
              dragConstraints={{ left: 0, right: 0 }}
              onMouseUp={handleSelection} // Check for text selection
              onMouseDown={handleSelection} // Also check on click
              onTouchEnd={handleSelection} // Detect selection on mobile
              onDragEnd={(_event, info) => {
                if (!isTextSelected) {
                  // 🛑 Prevent page swipe if text is selected
                  if (info.offset.x < -100) {
                    goToNextPage(); // Go to the next page on left swipe
                  } else if (info.offset.x > 100 && currentPage > 0) {
                    goToPreviousPage(); // Go to the previous page on right swipe
                  }
                }
              }}
            >
              <div>
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
                    <AudioPlayerStyled
                      audio={filteredDetails?.[currentPage]?.['ສຽງ']}
                    />
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
      </section>

      {/* Navigation Controls */}
      {renderPositionBar()}
    </>
  );
}
