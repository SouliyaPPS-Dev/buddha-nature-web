import { SearchIcon } from '@/components/layouts/icons';
import { useCalendar } from '@/hooks/calendar/useCalendar';
import { useScrollingStore } from '@/hooks/ScrollProvider';
import { extractPhoneNumber, lao } from '@/hooks/utils';
import { CalendarDataModel } from '@/model/calendar';
import { DateValue } from '@internationalized/date';
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@nextui-org/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Image } from 'antd';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import DOMPurify from 'dompurify';
import { useState } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ReactHtmlParser from 'react-html-parser';
import { IoShareSocialSharp } from 'react-icons/io5';
import { RiCloseLine, RiEyeLine, RiSearch2Line } from 'react-icons/ri';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// 📅 Laos Locale Configuration
const locales = { lao };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const Route = createFileRoute('/calendar/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { scrollContainerRef } = useScrollingStore();

  const { data, isLoading, searchTerm, setSearchTerm } = useCalendar();
  // 📅 State Management
  const [startDate, setStartDate] = useState<DateValue | null>(null);
  const [endDate, setEndDate] = useState<DateValue | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);

  // 🖥️ Modal State
  const [selectedEvent, setSelectedEvent] = useState<CalendarDataModel | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  // 🔍 Filtering Logic
  const filteredData = data.filter((item) => {
    const itemStartDate = new Date(item.startDateTime || '');
    const itemEndDate = new Date(item.endDateTime || '');
    return (
      (!startDate || itemStartDate >= new Date(startDate.toString())) &&
      (!endDate || itemEndDate <= new Date(endDate.toString()))
    );
  });
  const handleSearchClick = () => {
    setIsSearchExpanded(true); // Expand the search input
  };

  const handleCloseClick = () => {
    setSearchTerm(''); // Clear the search term
    setIsSearchExpanded(false); // Collapse the search input
  };

  const handleBlur = () => {
    if (!searchTerm) {
      setIsSearchExpanded(false); // Collapse the input if no search term
    }
  };

  // 📅 Random Color Generator
  const getRandomColor = () => {
    const colors = [
      '#f0e0d1',
      '#c7c3bc',
      '#e1cfbd',
      '#e4e1d7',
      '#cdcaca',
      '#e2e2d0',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const calendarEvents = data.map((item, index) => ({
    id: index + 1,
    title: item.title,
    start: parse(item.startDateTime || '', 'dd/MM/yyyy', new Date()),
    end: parse(item.endDateTime || '', 'dd/MM/yyyy', new Date()),
    color: getRandomColor(),
    details: item, // Attach full event details
  }));

  // 📅 Custom Event Component
  const EventComponent = ({ title, color, event }: any) => (
    <div
      className='flex overflow-x-auto'
      style={{ backgroundColor: color }}
      onClick={() => handleOpenModal(event)}
    >
      <div
        className='flex items-center justify-center'
        style={{ backgroundColor: color }}
      >
        <div className='flex justify-between items-center gap-2 p-1 text-black'>
          <RiEyeLine
            className='w-5 h-5 cursor-pointer text-center'
            onClick={() => handleOpenModal(event)}
          />
          {title}
        </div>
      </div>
    </div>
  );

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
        <div style={{ fontSize: `20px` }} className='cursor-text'>
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
              style={{ fontSize: `20px` }}
            >
              {ReactHtmlParser(part)}
            </span>
          );
        }
        return <span key={index}>{ReactHtmlParser(part)}</span>;
      });
    }
  };

  const handleShareEvent = async (selectedEvent: CalendarDataModel | null) => {
    const url = window.location.href;

    if (navigator.share && selectedEvent) {
      try {
        await navigator.share({
          url: `${url}/${selectedEvent.title}`,
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <>
      <section
        ref={scrollContainerRef}
        className='flex flex-col items-center justify-center mb-1 mt-2'
      >
        {/* 🔍 Search and Filters */}
        {isSearchExpanded ? (
          <div className='flex flex-col md:flex-row gap-1 mb-3'>
            {/* Search Input */}
            <Input
              aria-label='Search'
              labelPlacement='outside'
              type='search'
              placeholder='ຄົ້ນຫາ...'
              startContent={
                <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={handleBlur}
              className='w-full md:w-1/3'
            />
            {/* Date Range Picker */}
            <div className='flex gap-1 items-center w-full md:w-2/3'>
              <DatePicker
                label='Start Date'
                value={startDate}
                onChange={setStartDate}
                className='w-1/2'
              />
              <DatePicker
                label='End Date'
                value={endDate}
                onChange={setEndDate}
                className='w-1/2'
              />
            </div>
            {/* Reset Filters */}{' '}
            <Button
              onClick={() => {
                setSearchTerm('');
                setStartDate(null);
                setEndDate(null);
              }}
              color='primary'
            >
              Reset
            </Button>
          </div>
        ) : (
          <button
            onClick={handleSearchClick}
            className='absolute top-0 right-0 mt-16 mr-2 z-10'
          >
            <RiSearch2Line className='w-6 h-6' />
          </button>
        )}

        {/* Search Results */}
        {!isLoading && searchTerm !== '' && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2'>
            {filteredData.map((event, index) => (
              <Link
                key={index}
                to={`/calendar/${event.title}`}
                style={{
                  backgroundColor: 'default-100',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
                className='p-4 border border-gray-200 rounded-lg shadow-sm text-center'
              >
                <h2
                  className='font-semibold text-lg'
                  style={{
                    marginBottom: '0.5rem',
                  }}
                >
                  {event.title}
                </h2>
                <p className='text-sm '>
                  📅 {event.startDateTime} - {event.endDateTime}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* ❌ Close Search */}
        {isSearchExpanded && (
          <button
            className='absolute top-0 right-0 mt-16 mr-2 flex items-center justify-center gap-1'
            onClick={handleCloseClick}
          >
            <RiCloseLine className='w-6 h-6' />
          </button>
        )}

        {/* ⏳ Loading State */}
        {isLoading && (
          <div className='flex justify-center my-8'>
            <Spinner />
          </div>
        )}

        {!isLoading && (
          <div className='relative w-full p-0 z-1 mb-2'>
            {/* Swiper Slider */}
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1 }, // For mobile devices
                768: { slidesPerView: 1 }, // For tablets
                1024: { slidesPerView: 1 }, // For desktop
              }}
              className='w-full'
            >
              {filteredData.reverse().map((event, index) => (
                <SwiperSlide key={index}>
                  <div className='w-full max-h-[50vh] h-[200px] lg:h-[50vh] rounded-lg shadow-sm overflow-hidden'>
                    {/* Image with limited height */}
                    <div className='w-full h-full relative'>
                      <Image
                        src={event.poster}
                        alt={event?.title || ''}
                        width='100%'
                        height='100%'
                        style={{
                          objectFit: 'contain', // Scale image to fit without distortion
                          maxHeight: '100%', // Prevent exceeding container's height
                        }}
                        className='rounded-t-lg'
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* 📅 Calendar */}
        {!isLoading && (
          <div className='w-full h-[600px] mt-0 bg-white text-black p-4 rounded-lg shadow-lg mb-1'>
            <Calendar
              localizer={localizer}
              culture='lao'
              defaultDate={new Date()}
              events={calendarEvents}
              startAccessor='start'
              endAccessor='end'
              style={{ height: '100%', borderRadius: '12px' }}
              views={['month', 'week', 'day', 'agenda']}
              view={currentView}
              onView={(view) => setCurrentView(view)}
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              components={{
                event: ({ event }) => (
                  <EventComponent
                    title={event.title}
                    color={event.color}
                    event={event.details}
                  />
                ),
              }}
              popup
            />
          </div>
        )}

        {/* 📅 Event Cards */}
        {!isLoading && searchTerm === '' && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20'>
            {filteredData.map((event, index) => (
              <div
                key={index}
                className='flex flex-col h-full p-4 shadow-md rounded-lg bg-gray-100'
              >
                {/* Image Section */}
                <div className='w-full h-[150px] md:h-[200px] lg:h-[150px] overflow-hidden'>
                  <Image
                    src={event.poster}
                    alt={`Poster for ${event.title}`}
                    className='w-full h-full object-cover rounded-t-lg'
                  />
                </div>

                {/* Content Section */}
                <Link to={`/calendar/${event.title}`} className='flex-shrink-0'>
                  <div className='flex flex-col justify-between flex-grow p-4'>
                    <div>
                      <h3
                        className='text-lg font-semibold truncate text-black'
                        title={event.title} // Tooltip for long titles
                      >
                        {event.title}
                      </h3>
                      <p className='text-sm text-black mt-2'>
                        Start: {event.startDateTime || ''} — End:{' '}
                        {event.endDateTime || ''}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Share Icon Section */}
                <div
                  className='flex justify-end'
                  style={{ marginTop: '-40px' }}
                >
                  <IoShareSocialSharp
                    className='w-6 h-6 text-gray-500 cursor-pointer hover:text-primary-500'
                    onClick={() => handleShareEvent(event)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🚫 No Events Found */}
        {!isLoading && filteredData.length === 0 && (
          <p className='text-center text-gray-500 mt-6'>No events found.</p>
        )}

        {/* 📋 Modal for Event Details */}
        {/* Overlay Click Handling */}
        <div onClick={handleCloseModal}>
          <Modal
            isOpen={isModalOpen}
            hideCloseButton={true}
            placement='center'
            className='max-w-full h-full overflow-auto px-4 sm:px-4 md:px-4'
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              className='relative w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-3xl mx-auto'
            >
              {/* 🚀 Close Button on Top-Left */}
              <button
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '0.8rem',
                  right: '1.5rem',
                }}
                className='text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 z-20'
              >
                ✖️
              </button>

              <ModalHeader className='text-lg md:text-xl lg:text-2xl font-bold'>
                Event Details
              </ModalHeader>
              <ModalBody>
                {selectedEvent && (
                  <>
                    {isLoading && (
                      <div className='flex justify-center items-center'>
                        <Spinner />
                      </div>
                    )}

                    <div className='w-full max-h-[50vh] h-[250px] lg:h-[50vh] overflow-hidden'>
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
                    <div className='flex flex-col items-center justify-center gap-2'>
                      {/* Event Title */}
                      <p>
                        <strong className='text-lg md:text-xl lg:text-2xl font-bold'>
                          {selectedEvent.title}
                        </strong>
                      </p>

                      {/* Event Dates */}
                      <div className='flex items-center justify-center gap-2'>
                        <p>
                          <strong className='font-semibold'>
                            Start Date:&nbsp;
                          </strong>
                          {selectedEvent.startDateTime}
                        </p>
                        <span>|</span>
                        <p>
                          <strong className='font-semibold'>
                            End Date:&nbsp;
                          </strong>
                          {selectedEvent.endDateTime}
                        </p>
                      </div>

                      {/* Event Details */}
                      <div className='flex flex-wrap justify-center'>
                        {renderDetail(
                          selectedEvent.details || 'No description available.'
                        )}
                      </div>

                      {/* Phone Numbers */}
                      {selectedEvent?.details && (
                        <div className='flex flex-wrap justify-center'>
                          {extractPhoneNumber(selectedEvent.details)}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleCloseModal} color='primary'>
                  Close
                </Button>
                <Button
                  onClick={() => handleShareEvent(selectedEvent)}
                  color='primary'
                >
                  <IoShareSocialSharp className='w-5 h-5 mr-2' />
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </section>
    </>
  );
}
