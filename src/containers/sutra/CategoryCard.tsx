import { SutraDataArray } from '@/model/sutra';
import { Card, CardBody, Image, Spinner } from "@heroui/react";
import { Link } from '@tanstack/react-router';
import { memo } from 'react';

type CategoryCardProps = {
  category: string;
  item: SutraDataArray[number];
  isLoading: boolean;
};

const CategoryCard = memo(
  ({ category, item, isLoading }: CategoryCardProps) => {
    return (
      <Link
        to={`/sutra/${category}`}
        className='flex justify-center items-center cursor-pointer'
      >
        <Card
          isHoverable
          isFooterBlurred
          className='w-full max-w-[200px] h-auto'
        >
          <CardBody className='overflow-hidden p-0 relative'>
            {isLoading && (
              <div className='absolute inset-0 flex items-center justify-center text-black'>
                <Spinner
                  title={item['ຊື່ພຣະສູດ']}
                  size='lg'
                  className='text-black'
                />
              </div>
            )}
            {/* Fallback to text if image fails */}

            <Image
              removeWrapper
              loading='lazy'
              shadow='sm'
              radius='lg'
              alt={item['ຊື່ພຣະສູດ']}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                isLoading ? 'opacity-100' : 'opacity-0'
              }`}
              isLoading={isLoading}
              src={`/images/sutra/${category}.jpg`}
            />
          </CardBody>
        </Card>
      </Link>
    );
  }
);

export default CategoryCard;
