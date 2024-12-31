import VideoCard from '@/containers/video/VideoCard';
import { useScrollingStore } from '@/hooks/ScrollProvider';
import useVideo from '@/hooks/video/useVideo';
import { VideoDataModel } from '@/model/video';
import { Spinner } from '@nextui-org/spinner';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/video/view/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { scrollContainerRef } = useScrollingStore();
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

  // Extract Video Link
  const embedLink = extractVideoLink(originalLink);

  return (
    <section
      ref={scrollContainerRef}
      className='w-full min-h-screen dark:bg-[#181818] items-center justify-center'
    >
      {/* Video Player Section */}
      <div className='flex justify-center'>
        <div className='w-full max-w-6xl aspect-video'>
          {embedLink ? (
            <>
              <iframe
                id='videoPlayer'
                width='100%'
                height='100%'
                src={embedLink}
                title='Video Player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen'
                allowFullScreen
                className='shadow-lg'
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling='no'
                frameBorder='0'
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
              transition: 'width 0.3s ease-in-out',
            }}
          >
            {/* Top Shelf */}
            <div className='absolute top-0 left-0 w-full h-1 sm:h-3 md:h-4 bg-[#B96A44] shadow-lg'></div>

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
            <div className='absolute -top-2 left-2 w-[96%] h-4 bg-black opacity-10 blur-md'></div>
          </div>
        </div>
      </div>

      {/* Video Details Section */}
      <div
        className='w-full max-w-6xl mx-auto p-4'
        style={{ marginTop: '-1rem', marginBottom: '-2.5rem' }}
      >
        {/* Title */}
        <h1
          className='font-bold text-[#fff] dark:text-white text-center'
          style={{ fontSize: '1rem' }}
        >
          {videoTitle}&nbsp;({videoDescription})
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
                      width: '105%',
                      transition: 'width 0.3s ease-in-out',
                    }}
                  >
                    {/* Top Shelf */}
                    <div className='absolute top-0 left-0 w-full h-1 sm:h-3 md:h-4 bg-[#B96A44] shadow-lg'></div>

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
                    <div className='absolute -top-2 left-2 w-[96%] h-4 bg-black opacity-10 blur-md'></div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

// 📹 **Helper Function to Extract Video Embed Links**
function extractVideoLink(url: string): string | null {
  try {
    // Match YouTube Links
    const youtubeRegex =
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*shorts\/))([\w-]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Match Google Drive Links
    const googleDriveRegex = /drive\.google\.com\/file\/d\/([\w-]+)\//;
    const googleDriveMatch = url.match(googleDriveRegex);
    if (googleDriveMatch) {
      return `https://drive.google.com/file/d/${googleDriveMatch[1]}/preview`;
    }

    // Match Facebook Video Links (Watch URLs)
    const facebookWatchRegex = /facebook\.com\/watch\/\?v=([\d]+)/;
    const facebookWatchMatch = url.match(facebookWatchRegex);
    if (facebookWatchMatch) {
      return `https://www.facebook.com/video/embed?video_id=${facebookWatchMatch[1]}`;
    }

    // Match Facebook Video Links (Full URLs)
    const facebookVideoRegex = /facebook\.com\/.*\/videos\/([\d]+)/;
    const facebookVideoMatch = url.match(facebookVideoRegex);
    if (facebookVideoMatch) {
      return `https://www.facebook.com/video/embed?video_id=${facebookVideoMatch[1]}`;
    }

    // Match Facebook Post Links
    const facebookPostRegex = /facebook\.com\/plugins\/post\.php\?href=([^&]+)/;
    const facebookPostMatch = url.match(facebookPostRegex);
    if (facebookPostMatch) {
      return `https://www.facebook.com/plugins/post.php?href=${facebookPostMatch[1]}&show_text=true&width=100`;
    }

    return null;
  } catch (error) {
    console.error('Failed to extract video link:', error);
    return null;
  }
}
