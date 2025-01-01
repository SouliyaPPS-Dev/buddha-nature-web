import { SearchIcon } from '@/components/layouts/icons';
import { useCalendar } from '@/hooks/calendar/useCalendar';
import { useScrollingStore } from '@/hooks/ScrollProvider';
import { lao } from '@/hooks/utils';
import { DateValue } from '@internationalized/date';
import { Button, DatePicker, Input, Spinner } from '@nextui-org/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { useState } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { RiCloseLine, RiEyeLine, RiSearch2Line } from 'react-icons/ri';

// 📅 Laos Locale Configuration
const locales = {
  lao,
};

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
  const [currentDate, setCurrentDate] = useState(new Date()); // Calendar navigation
  const [currentView, setCurrentView] = useState<View>(Views.MONTH); // Calendar view state

  // 🔍 Handle Filtering by Date Range
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
      '#f0e0d1', // Soft beige (earthy)
      '#c7c3bc', // Sage gray (muted greenish-gray)
      '#e1cfbd', // Light warm taupe
      '#e4e1d7', // Warm sand
      '#cdcaca', // Soft stone gray
      '#e2e2d0', // Subtle olive gray
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const startDates = data.map((item) => item.startDateTime);
  const endDates = data.map((item) => item.endDateTime);

  // 🎯 Transform data for Calendar Event Format with random colors
  const calendarEvents = startDates.map((startDate, index) => {
    const endDate = endDates[index];
    return {
      id: index + 1, // Unique identifier
      title: data[index].title,
      start: parse(startDate || '', 'dd/MM/yyyy', new Date()),
      end: parse(endDate || '', 'dd/MM/yyyy', new Date()),
      color: getRandomColor(), // Assign a random color to each event
    };
  });

  // 📅 Custom Event Component with random color
  const EventComponent = ({ title, color }: any) => (
    <div className='flex overflow-x-auto'>
      <Link
        to={`/calendar/${title}`}
        className='flex items-center justify-center'
        style={{ backgroundColor: color }} // Apply the color to each event
      >
        <div className='flex justify-between items-center gap-2 p-1 text-black'>
          <RiEyeLine className='w-5 h-5 cursor-pointer text-center' /> {title}
        </div>
      </Link>
    </div>
  );

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

            {/* Reset Filters */}
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
            className='absolute top-0 right-0 mt-16 mr-2 flex items-center justify-center gap-1'
            onClick={handleSearchClick}
          >
            <RiSearch2Line className='w-6 h-6' />
          </button>
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
            <Spinner label='Loading events...' />
          </div>
        )}

        {/* 📅 Event Cards */}
        {!isLoading && searchTerm !== '' && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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

        {/* 📅 Calendar */}
        {!isLoading && searchTerm === '' && (
          <>
            <div className='w-full h-[600px] mt-0 bg-gradient-to-t p-4 rounded-lg shadow-lg'>
              <Calendar
                localizer={localizer}
                culture='lao'
                defaultDate={new Date()}
                events={calendarEvents}
                startAccessor='start'
                endAccessor='end'
                style={{
                  height: '100%',
                  borderRadius: '12px', // Rounded corners for a smooth look
                }}
                views={['month', 'week', 'day', 'agenda']}
                view={currentView}
                onView={(view) => setCurrentView(view)}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                components={{
                  event: ({ title }) => (
                    <EventComponent title={title} color={getRandomColor()} />
                  ),
                }}
                popup
              />
            </div>
          </>
        )}

        {/* 🚫 No Events Found */}
        {!isLoading && filteredData.length === 0 && (
          <p className='text-center text-gray-500 mt-6'>No events found.</p>
        )}
      </section>
    </>
  );
}
