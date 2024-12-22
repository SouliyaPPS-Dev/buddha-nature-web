import { SutraDataArray } from '@/model/sutra';
import { Card, CardBody, Image, Spinner } from '@nextui-org/react';
import { Link } from '@tanstack/react-router';
import { useEffect } from 'react';

/* CategoryCard Component */
type CategoryCardProps = {
  category: string;
  item: SutraDataArray[number];
  isLoading: boolean;
};

function CategoryCard({ category, item, isLoading }: CategoryCardProps) {
  useEffect(() => {
    const img = document.createElement('img');
    img.src = `/images/sutra/${category}.jpg`;
  }, [category]);

  return (
    <Link
      to={`/sutra/${category}`}
      className='flex justify-center items-center z-1 cursor-pointer'
    >
      <Card
        isHoverable
        isFooterBlurred
        className='w-full max-w-[200px] h-auto z-1'
      >
        <CardBody className='overflow-hidden p-0 relative z-1'>
          {/* Show spinner while image is loading */}
          {!isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-200'>
              <Spinner size='sm' />
            </div>
          )}

          {/* Show image after loading */}
          <Image
            removeWrapper
            loading='lazy'
            shadow='sm'
            radius='lg'
            alt={item['ຊື່ພຣະສູດ']}
            className={`z-0 w-full h-full object-contain transition-opacity duration-300 ${
              isLoading ? 'opacity-100' : 'opacity-0'
            }`}
            src={`/images/sutra/${category}.jpg`}
          />
        </CardBody>
      </Card>
    </Link>
  );
}

export default CategoryCard;
