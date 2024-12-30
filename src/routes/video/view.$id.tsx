import VideoCard from '@/containers/video/VideoCard';
import useVideo from '@/hooks/video/useVideo';
import { VideoDataModel } from '@/model/video';
import { Spinner } from '@nextui-org/spinner';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/video/view/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data, isLoading } = useVideo();

  const { id } = params;

  // Filter the selected video based on ID
  const filteredItems = data?.filter((item: VideoDataModel) => {
    return id ? item['ID'] === id : true;
  });

  const originalLink = filteredItems?.[0]?.['link'] || '';
  const videoTitle = filteredItems?.[0]?.['ຊື່ພຣະສູດ'] || 'Untitled Video';
  const videoDescription = filteredItems?.[0]?.['ໝວດທັມ'] || '';

  // Extract video ID from the YouTube link
  const videoId = extractYouTubeId(originalLink);
  const embedLink = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

  return (
    <section className='w-full min-h-screen dark:bg-[#181818] items-center justify-center'>
      {/* Video Player Section */}
      <div className='flex justify-center'>
        <div className='w-full max-w-6xl aspect-video'>
          {embedLink ? (
            <>
              <iframe
                width='100%'
                height='100%'
                src={embedLink}
                title='YouTube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
                className='shadow-lg'
              />
            </>
          ) : (
            <p className='text-red-500 text-center py-10'>
              Invalid or missing YouTube link
            </p>
          )}
          {/* Divider (3D Tray with Shadow Effect) */}
          <div
            className='relative w-full mt-0 h-6 sm:h-5 md:h-6 lg:h-8 z-1'
            style={{
              width: '100%',
              zIndex: 1,
            }}
          >
            {/* Top Shelf */}
            <div className='absolute top-0 left-0 w-full h-1 sm:h-3 md:h-4 bg-[#B96A44] rounded-t-md shadow-lg'></div>

            {/* Middle Edge */}
            <div
              className='absolute top-1 left-0 w-full h-2 sm:h-1.5 bg-[#E0895C] shadow mb-0'
              style={{ marginBottom: '-5.5em' }}
            ></div>

            {/* Bottom Shelf */}
            <div className='absolute bottom-0 left-0 w-full h-1 bg-[#A65D3B] shadow-inner mb-4'></div>
            <div className='absolute bottom-0 left-0 w-full h-1 mb:h-1 sm:h-2 lg:h-2 bg-[#B96A44] shadow-inner mb-3'></div>

            {/* Glossy Effect */}
            <div className='absolute top-0 left-0 w-full h-4 bg-[#E0895C] opacity-50'></div>

            {/* Book Shadow Effect */}
            <div className='absolute -top-2 left-2 w-[96%] h-4 bg-black opacity-10 blur-md rounded-md'></div>
          </div>
        </div>
      </div>

      {/* Video Details Section */}
      <div
        className='w-full max-w-6xl mx-auto p-4'
        style={{ marginTop: '-1rem', marginBottom: '-2.5rem' }}
      >
        {/* Title */}
        <h1 className='text-xl font-bold text-[#fff] dark:text-white text-center'>
          {videoTitle}
          <p className='text-sm text-[#fff] dark:text-gray-300 line-clamp-3'>
            {/* Description */}
            {videoDescription}
          </p>
        </h1>
      </div>

      <div className='flex flex-col items-center justify-center mb-5'>
        {/* Display Loading Spinner if Data is Loading */}
        {isLoading ? (
          <div className='w-full flex justify-center mt-8'>
            <Spinner size='lg' />
          </div>
        ) : (
          <div className='grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 mb-20'>
            {data
              ?.slice()
              .reverse()
              .map((item) => (
                <div
                  key={item['ID']}
                  className='flex flex-col items-center'
                  style={{ marginBottom: '-2.3rem' }}
                >
                  {/* Video Card */}
                  <VideoCard
                    id={item['ID']}
                    item={item}
                    isLoading={isLoading}
                  />

                  {/* Divider (3D Tray with Shadow Effect) */}
                  <div
                    className='relative w-full mt-4 h-6 sm:h-5 md:h-6 lg:h-8 z-1'
                    style={{
                      width: '130%',
                      zIndex: 1,
                    }}
                  >
                    {/* Top Shelf */}
                    <div className='absolute top-0 left-0 w-full h-1 sm:h-3 md:h-4 bg-[#B96A44] rounded-t-md shadow-lg'></div>

                    {/* Middle Edge */}
                    <div
                      className='absolute top-1 left-0 w-full h-2 sm:h-1.5 bg-[#E0895C] shadow mb-0'
                      style={{ marginBottom: '-5.5em' }}
                    ></div>

                    {/* Bottom Shelf */}
                    <div className='absolute bottom-0 left-0 w-full h-1 bg-[#A65D3B] shadow-inner mb-4'></div>
                    <div className='absolute bottom-0 left-0 w-full h-1 mb:h-1 sm:h-2 lg:h-2 bg-[#B96A44] shadow-inner mb-3'></div>

                    {/* Glossy Effect */}
                    <div className='absolute top-0 left-0 w-full h-4 bg-[#E0895C] opacity-50'></div>

                    {/* Book Shadow Effect */}
                    <div className='absolute -top-2 left-2 w-[96%] h-4 bg-black opacity-10 blur-md rounded-md'></div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string | null {
  try {
    const regex =
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*shorts\/))([\w-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Failed to extract YouTube ID:', error);
    return null;
  }
}
