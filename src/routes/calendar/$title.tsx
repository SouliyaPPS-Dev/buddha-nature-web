import { useCalendar } from '@/hooks/calendar/useCalendar';
import { useScrollingStore } from '@/hooks/ScrollProvider';
import { createFileRoute } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import ReactHtmlParser from 'react-html-parser';
import { Image } from 'antd';
import { Spinner } from '@nextui-org/spinner';
import { extractPhoneNumber } from '@/hooks/utils';

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
        <div style={{ fontSize: `18px` }} className='cursor-text'>
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

        <div className='w-full max-h-[50vh] h-[200px] lg:h-[50vh] overflow-hidden'>
          {/* Image with limited height */}
          <div className='w-full h-full relative'>
            <Image
              src={selectedEvent?.poster}
              alt={selectedEvent?.title || ''}
              loading={isLoading ? 'lazy' : 'eager'}
              width='100%'
              height='100%'
              style={{
                display: isLoading ? 'none' : 'block',
                objectFit: 'contain', // Scale image to fit without distortion
                maxHeight: '100%',
              }} // Hide image while loading
            />
          </div>
        </div>

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
