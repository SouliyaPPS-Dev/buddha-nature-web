import { useUpdateSutraData } from '@/hooks/sutra/useUpdateSutraData';
import { GrUpdate } from 'react-icons/gr';
import { RxUpdate } from 'react-icons/rx';
export const ButtonUpdateData = () => {
  const { isLoading, handleUpdate } = useUpdateSutraData();

  return (
    <button
      onClick={handleUpdate}
      disabled={isLoading}
      className='p-2 rounded-full transition disabled:opacity-50'
      aria-label='Update data'
    >
      {isLoading ? (
        <GrUpdate className='animate-spin text-lg' />
      ) : (
        <RxUpdate className='text-lg' />
      )}
    </button>
  );
};
