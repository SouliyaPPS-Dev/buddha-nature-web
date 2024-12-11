import { Card, CardBody } from '@nextui-org/react';
import { useState } from 'react';
import Highlighter from 'react-highlight-words';
import { FiMinus, FiPlus } from 'react-icons/fi';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

function SutraCard({
  title,
  detail,
  searchTerm,
  onClick,
}: {
  title: string;
  detail: string;
  searchTerm?: string;
  onClick: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false); // State to track collapse/expand
  const [fontSize, setFontSize] = useState(18); // State to manage font size (default 16px)

  // Function to parse, sanitize, and highlight content with bold tags
  const renderDetail = (htmlContent: string, searchTerm?: string) => {
    const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
    const contentWithBreaks = sanitizedHtmlContent.replace(/\n/g, '<br/>');

    // If no searchTerm is provided or it's empty, render the content directly
    if (!searchTerm?.trim()) {
      return (
        <div contentEditable={true} style={{ fontSize: `${fontSize}px` }}>
          {parse(contentWithBreaks)}
          {/* Render content with cursor but prevent editing */}
        </div>
      );
    }

    // Highlight content if searchTerm is provided
    const parts = contentWithBreaks.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <span key={index} className='bg-yellow-200 font-bold text-black'>
            {part}
          </span>
        );
      }

      return <span key={index}>{parse(part)}</span>;
    });
  };

  // Handlers to adjust font size
  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32)); // Max 32px
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12)); // Min 12px

  return (
    <Card className='cursor-pointer' onClick={onClick}>
      <CardBody className='text-xl flex flex-col'>
        <div className='flex items-center gap-2'>
          {/* Toggle Button */}
          <span
            onClick={() => {
              setIsExpanded(!isExpanded);
            }} // Toggle the state
            className='cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-full p-1 flex items-center justify-center text-sm w-6 h-6'
          >
            {isExpanded ? (
              <FiMinus className='text-gray-600' /> // Minus icon
            ) : (
              <FiPlus className='text-gray-600' /> // Plus icon
            )}
          </span>
          {/* Highlighted Title */}
          <Highlighter
            highlightClassName='bg-yellow-200 font-bold'
            searchWords={[searchTerm || '']}
            autoEscape={true}
            textToHighlight={title}
            style={{ fontSize: `18px` }} // Dynamically set the font size
          />
        </div>
        {/* Collapsible Content (with scrollable area) */}
        {isExpanded && (
          <>
            {/* Scrollable Content */}
            <div
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
                >
                  A-
                </button>
                <button
                  onClick={increaseFontSize}
                  className='rounded px-2 py-1 text-sm border'
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
