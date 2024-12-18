import { SutraDataArray } from '@/model/sutra';
import { Card, CardBody, Image, Spinner } from '@nextui-org/react';

import { Link } from '@tanstack/react-router';

/* CategoryCard Component */
type CategoryCardProps = {
  category: string;
  item: SutraDataArray[number];
  isLoading: boolean;
};

function CategoryCard({ category, item, isLoading }: CategoryCardProps) {
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
        <CardBody className='overflow-visible p-0 relative z-1'>
          {!isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-200'>
              <Spinner size='sm' />
            </div>
          )}
          <Image
            removeWrapper
            shadow='sm'
            radius='lg'
            alt={item['ຊື່ພຣະສູດ']}
            className={`z-0 w-full h-full object-contain transition-opacity duration-300 ${
              isLoading ? 'opacity-100' : 'opacity-0'
            }`} // Add smooth transition for images
            src={`/images/sutra/${category}.jpg`} // Dynamically resolve the image path
            onLoad={isLoading ? () => {} : () => {}} // Update isLoading state
            onError={() =>
              console.error(`Failed to load image for ${category}`)
            } // Handle potential errors
          />
        </CardBody>
      </Card>
    </Link>
  );
}

export default CategoryCard;
