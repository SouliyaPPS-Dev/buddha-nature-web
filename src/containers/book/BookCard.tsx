/* BookCard Component */
import { BookDataArray } from '@/model/book';
import { Card, CardBody, Image, Spinner } from '@heroui/react';
import { Link } from '@tanstack/react-router';
import { useEffect } from 'react';

type BookCardProps = {
  id: string;
  item: BookDataArray[number];
  isLoading: boolean;
};

function BookCard({ id, item, isLoading }: BookCardProps) {
  useEffect(() => {
    const img = document.createElement('img');
    img.src = `${item['imageURL']}`;
  }, [id]);

  return (
    <Link
      to={`/book/view/${id}`}
      className='z-10 flex flex-col justify-between items-center cursor-pointer'
    >
      {/* Responsive Card */}
      <Card
        isHoverable
        isFooterBlurred
        className='w-[115px] sm:w-[130px] md:w-[140px] lg:w-[185px] h-[205px] sm:h-[205px] md:h-[255px] lg:h-[305px] flex-shrink-0 mx-2 shadow-xl hover:shadow-3xl transition-transform duration-300 transform hover:-translate-y-2'
        style={{
          marginBottom: '-1.2rem',
          boxShadow: `
            0 10px 15px -3px rgba(0, 0, 0, 0.2), 
            0 4px 6px -2px rgba(0, 0, 0, 0.1),
            inset 0 -3px 6px rgba(0, 0, 0, 0.2)`,
          backgroundColor: 'transparent', // Ensure no background color on hover
          borderRadius: '0', // Remove all border radius
        }}
      >
        <CardBody
          className='overflow-hidden p-0 relative flex flex-col'
          style={{ borderRadius: '0' }} // Ensure no radius on CardBody
        >
          {/* Book Title (Hidden on Mobile) */}
          <div
            className='hidden sm:block flex-grow'
            style={{ marginTop: '0.5rem' }}
          >
            <p className='text-white text-center text-sm'>{item['ຊື່']}</p>
          </div>
          {/* Mobile Title Display */}
          <div className='block sm:hidden' style={{ marginTop: '0.5rem' }}>
            <p className='text-white text-center text-sm'>{item['ຊື່']}</p>
          </div>

          {/* Show spinner while image is loading */}
          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-200'>
              <Spinner size='sm' />
            </div>
          )}

          {/* Responsive Image */}
          <Image
            removeWrapper
            loading='lazy'
            shadow='lg'
            radius='none'
            alt={item['ຊື່']}
            src={item['imageURL']}
            style={{
              marginTop: '0.4rem',
              borderRadius: '0', // Ensure image has no rounded corners
            }}
            className={`z-0 object-fill transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } 
            h-[165px] sm:h-[200px] md:h-[220px] lg:h-[270px]`}
          />
        </CardBody>
      </Card>

      {/* Bottom Shadow for Extra Depth */}
      <div className='w-[90%] h-4 mt-[-1.5rem] bg-gray-900 opacity-25 blur-md'></div>
    </Link>
  );
}

export default BookCard;
