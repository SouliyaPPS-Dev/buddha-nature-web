import PauseIcon from '@/assets/images/pause.png';
import PlayIcon from '@/assets/images/play.png';
import { useFontSizeContext } from '@/components/FontSizeProvider';
import { Card, CardBody } from '@nextui-org/react';
import { Link } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import ReactHtmlParser from 'react-html-parser';
import { GrView } from 'react-icons/gr';

function SutraCard({
  title,
  detail,
  audio,
  searchTerm,
  route,
  onClick,
  isPlaying,
  onPlay,
}: {
  title: string;
  detail: string;
  audio?: string;
  searchTerm?: string;
  route?: string;
  onClick?: () => void;
  isPlaying?: boolean;
  onPlay?: () => void;
}) {
  const [isExpanded, _setIsExpanded] = useState(false); // State to track collapse/expand
  const { fontSize, setFontSize } = useFontSizeContext();

  // Manage Playback
  const [playing, setPlaying] = useState(false); // State to track play/pause
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle Play Event
  const handlePlay = () => {
    if (audioRef.current) {
      setPlaying(true); // Set playing to true when audio plays
      onPlay?.(); // Notify parent about the currently playing audio
      audioRef.current.play();
    }
  };

  // Handle Pause Event
  const handlePause = () => {
    if (audioRef.current) {
      setPlaying(false); // Set playing to false when audio pauses
      audioRef.current.pause();
    }
  };

  // Stop Audio on Unmount or Cleanup
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Manage Playback State (for initial control)
  useEffect(() => {
    if (isPlaying) {
      handlePlay();
    } else {
      handlePause();
    }
  }, [isPlaying]);

  // Cleanup
  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  // Function to parse, sanitize, and highlight content with bold tags
  const renderDetail = (htmlContent: string, searchTerm?: string) => {
    const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
    const contentWithBreaks = sanitizedHtmlContent.replace(/\n/g, '<br/>');

    // If no searchTerm is provided or it's empty, render the content directly
    if (!searchTerm?.trim()) {
      return (
        <div
          contentEditable={true}
          style={{
            fontSize: `${fontSize}px`,
          }}
          className='cursor-text'
        >
          {ReactHtmlParser(contentWithBreaks)}
        </div>
      );
    }

    // Highlight content if searchTerm is provided
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

  // Handlers to adjust font size
  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32)); // Max 32px
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12)); // Min 12px

  return (
    <Card>
      <CardBody className='text-xl flex flex-col'>
        {/* Toggle Button */}
        {/* <span
            onClick={() => {
              setIsExpanded(!isExpanded);
            }} // Toggle the state
            className='bg-gray-200 hover:bg-gray-300 rounded-full p-1 flex items-center justify-center text-sm w-6 h-6'
          >
            {isExpanded ? (
              <FiMinus className='text-gray-600' /> // Minus icon
            ) : (
              <FiPlus className='text-gray-600' /> // Plus icon
            )}
          </span> */}
        <div className='flex items-center gap-2 w-full'>
          <>
            <Link
              to={route}
              className='flex justify-between items-center w-full'
            >
              <Highlighter
                highlightClassName='bg-yellow-200 font-bold'
                searchWords={[searchTerm || '']}
                autoEscape={true}
                textToHighlight={title}
                style={{
                  fontSize: '18px',
                  display: 'inline-block',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.5',
                  maxWidth: '100%',
                }}
              />
              <GrView
                onClick={onClick}
                className='cursor-pointer text-gray-600 hidden'
              />
            </Link>
          </>
          {audio && audio !== '/' && (
            <>
              {/* Center the button */}
              <audio
                ref={audioRef}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleStop}
              >
                <source src={audio} type='audio/mpeg' />
              </audio>
              <button
                onClick={() => {
                  if (playing) {
                    handlePause();
                  } else {
                    handlePlay();
                  }
                }}
                className='flex justify-center items-center'
              >
                {playing ? (
                  <img src={PauseIcon} alt='Pause' className='w-9' />
                ) : (
                  <img src={PlayIcon} alt='Play' className='w-10' />
                )}
              </button>
            </>
          )}
        </div>

        {/* Collapsible Content (with scrollable area) */}
        {isExpanded && (
          <>
            {/* Scrollable Content */}
            <div
              contentEditable={true}
              className='mt-2 prose mx-auto overflow-y-auto border rounded-md p-4 w-full'
              style={{
                maxHeight: '200px', // Scrollable content area
                fontSize: `${fontSize}px`, // Dynamic font size
              }}
            >
              {renderDetail(detail, searchTerm)}
              {/* Font Size Controls */}
              <div className='flex justify-end gap-2 mt-2 sticky bottom-0 cursor-pointer'>
                <button
                  onClick={decreaseFontSize}
                  className='rounded px-2 py-1 text-sm border'
                  style={{
                    borderRadius: '0.25rem', // Smaller rounded corners
                    padding: '0.25rem 0.75rem', // Compact padding
                    fontSize: '0.875rem', // Slightly smaller font
                    fontWeight: '500', // Medium weight for text
                    color: '#fff', // White text
                    border: 'none', // No border
                    background: 'linear-gradient(135deg, #8B5E3C, #D4A054)', // Subtle brown gradient
                    cursor: 'pointer', // Pointer cursor
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Minimal shadow
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Smooth animation
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
                  className='rounded px-2 py-1 text-sm border'
                  style={{
                    borderRadius: '0.25rem', // Smaller rounded corners
                    padding: '0.25rem 0.75rem', // Compact padding
                    fontSize: '0.875rem', // Slightly smaller font
                    fontWeight: '500', // Medium weight for text
                    color: '#fff', // White text
                    border: 'none', // No border
                    background: 'linear-gradient(135deg, #5E412D, #8B5E3C)', // Subtle earthy gradient
                    cursor: 'pointer', // Pointer cursor
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Minimal shadow
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Smooth animation
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
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

export default SutraCard;
