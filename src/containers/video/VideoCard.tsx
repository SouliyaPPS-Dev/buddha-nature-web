import { VideoDataArray } from '@/model/video';
import { Card, CardBody, Image, Spinner } from "@heroui/react";
import { Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAtTop } from 'react-scroll-to-bottom';

type VideoCardProps = {
  id: string;
  item: VideoDataArray[number];
  isLoading: boolean;
};

function VideoCard({ id, item, isLoading }: VideoCardProps) {
  // Extract the video link from the item
  const originalLink = item['link'] || '';

  // Determine the thumbnail URL based on the video source (YouTube or Google Drive)
  const thumbnailUrl: string = getThumbnailUrl(originalLink);

  // Function to extract thumbnail URL based on the video link
  function getThumbnailUrl(link: string): string {
    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      const videoId = extractYouTubeId(link);
      return videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : '';
    } else if (link.includes('drive.google.com')) {
      // Google Drive video thumbnail extraction logic
      const fileId = extractGoogleDriveFileId(link);

      return fileId !== ''
        ? `https://lh3.googleusercontent.com/d/${fileId}=s320?authuser=0`
        : `https://lh3.googleusercontent.com/d/${fileId}=s320?authuser=0`;
    }
    return '';
  }

  // Helper function to extract YouTube video ID
  function extractYouTubeId(url: string): string | null {
    const regex =
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*shorts\/))([\w-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Helper function to extract Google Drive file ID
  function extractGoogleDriveFileId(url: string): string | null {
    const regex =
      /(?:drive\.google\.com\/(?:.*\/d\/|file\/d\/))([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  useEffect(() => {
    const img = document.createElement('img');
    img.src = `${thumbnailUrl}`;
  }, [id]);

  return (
    <Link
      to={`/video/view/${id}`}
      className='z-10 flex flex-col justify-between items-center cursor-pointer'
      onClick={() => {
        useAtTop();
      }}
    >
      {/* Responsive Card */}
      <Card
        isHoverable
        isFooterBlurred
        className='w-[165px] sm:w-[190px] md:w-[200px] lg:w-[272px] h-[205px] sm:h-[205px] md:h-[255px] lg:h-[305px] flex-shrink-0 mx-2 shadow-xl hover:shadow-3xl transition-transform duration-300 transform hover:-translate-y-2'
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
            style={{ marginTop: '2.5rem' }}
          >
            <p className='text-white text-center text-sm line-clamp-2 overflow-hidden'>
              {item['ຊື່ພຣະສູດ']}
            </p>
          </div>

          {/* Mobile Title Display */}
          <div className='block sm:hidden' style={{ marginTop: '2.5rem' }}>
            <p className='text-white text-center text-sm line-clamp-2 overflow-hidden'>
              {item['ຊື່ພຣະສູດ']}
            </p>
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
            alt={item['ຊື່ພຣະສູດ']}
            src={thumbnailUrl}
            style={{
              marginTop: '0.4rem',
              borderRadius: '0', // Ensure image has no rounded corners
            }}
            className={`z-0 object-fill transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } 
            h-[145px] sm:h-[160px] md:h-[180px] lg:h-[230px]`}
          />
        </CardBody>
      </Card>

      {/* Bottom Shadow for Extra Depth */}
      <div className='w-[90%] h-4 mt-[-1.5rem] bg-gray-900 opacity-25 blur-md'></div>
    </Link>
  );
}

export default VideoCard;
