import { queryClient } from '@/services/react-query/client';
import { useQuery } from '@tanstack/react-query';
import { FaDownload } from 'react-icons/fa';

function DownloadBook() {
  const { data } = useQuery({
    queryKey: ['downloadBookLink'],
    queryFn: async () =>
      queryClient.getQueryState(['downloadBookLink'])?.data as string,
    staleTime: 1,
  });

  return (
    <>
      <a
        href={data}
        download
        target='_blank'
        rel='noopener noreferrer'
        className='cursor-pointer'
      >
        <FaDownload
          size={18}
          className='text-white hover:text-white mt-1'
          aria-label='Download'
          title='Download'
        />
      </a>
    </>
  );
}

export default DownloadBook;
