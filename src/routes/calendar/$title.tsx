import { useCalendar } from '@/hooks/calendar/useCalendar';
import { useScrollingStore } from '@/hooks/ScrollProvider';
import { createFileRoute } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import ReactHtmlParser from 'react-html-parser';
import { Image } from 'antd';
import { Spinner } from '@nextui-org/spinner';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

export const Route = createFileRoute('/calendar/$title')({
  component: RouteComponent,
});

function RouteComponent() {
  const { scrollContainerRef } = useScrollingStore();

  const { title } = Route.useParams();
  const { data, isLoading } = useCalendar();

  const filteredData = data.filter((event) => event.title === title);
  const selectedEvent = filteredData.length > 0 ? filteredData[0] : null;

  // Function to sanitize and parse HTML content
  const renderDetail = (
    htmlContent: string | undefined,
    searchTerm?: string
  ) => {
    const sanitizedHtmlContent = DOMPurify.sanitize(
      htmlContent || 'No description available.'
    );
    const contentWithBreaks = sanitizedHtmlContent.replace(/\n/g, '<br/>');

    if (!searchTerm?.trim()) {
      return (
        <div
          style={{ fontSize: `18px` }}
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
              style={{ fontSize: `18px` }}
            >
              {ReactHtmlParser(part)}
            </span>
          );
        }
        return <span key={index}>{ReactHtmlParser(part)}</span>;
      });
    }
  };

  // Function to extract phone number and create links
  const extractPhoneNumber = (text: string) => {
    // Regular expression for Laos phone numbers starting with 020
    const phoneRegex = /(0\d{8,9})/g;
    const match = text.match(phoneRegex);

    if (match) {
      const phoneNumber = match[0].replace(/\D/g, ''); // Removing non-numeric characters
      return (
        <>
          <a href={`tel:+856${phoneNumber.slice(1)}`} className='text-blue-500'>
            <span className='flex items-center'>
              <span>Call {phoneNumber}</span>
              <FaPhoneAlt className='ml-1 w-4 h-4' />
            </span>
          </a>
          {' | '}
          <a
            href={`https://wa.me/+856${phoneNumber.slice(1)}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-green-500' // WhatsApp green color
          >
            <span className='flex items-center'>
              <span>WhatsApp</span>
              <FaWhatsapp className='ml-1 w-4 h-4 text-green-500' />{' '}
              {/* Green color for the WhatsApp icon */}
            </span>
          </a>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <section
        ref={scrollContainerRef}
        className='flex flex-col items-center justify-center mb-20 mt-2'
      >
        {isLoading && (
          <div className='flex justify-center items-center'>
            <Spinner />
          </div>
        )}
        <Image
          src={selectedEvent?.poster}
          alt='Event Poster'
          loading={isLoading ? 'lazy' : 'eager'}
          style={{
            display: isLoading ? 'none' : 'block',
            width: '100%',
            height: 'auto',
          }} // Hide image while loading
        />

        <br />

        <p>
          <strong
            className='font-bold'
            style={{
              fontSize: '20px',
            }}
          >
            {selectedEvent?.title}
          </strong>
        </p>

        <br />

        <p>
          <strong>Start Date:</strong> {selectedEvent?.startDateTime}
        </p>
        <p>
          <strong>End Date:</strong> {selectedEvent?.endDateTime}
        </p>

        <br />

        {/* Render Details */}
        {renderDetail(selectedEvent?.details || 'No description available.')}

        {/* Extract and display phone number links */}
        {selectedEvent?.details && extractPhoneNumber(selectedEvent?.details)}
      </section>
    </>
  );
}
