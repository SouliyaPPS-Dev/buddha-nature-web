import { useUpdateSutraData } from '@/hooks/sutra/useUpdateSutraData';
import { GrUpdate } from 'react-icons/gr';
import { RxUpdate } from 'react-icons/rx';
import { useConfirmationModal } from '@/components/ModalComponent';
export const ButtonUpdateData = () => {
  const { isLoading, handleUpdate } = useUpdateSutraData();
  const { openModal, ModalComponent } = useConfirmationModal();

  return (
    <>
      {/* Update Button */}
      <button
        onClick={() =>
          openModal({
            title: 'Confirm Update',
            message: 'ທ່ານຕ້ອງການ Update ຂໍ້ມູນບໍ່?',
            onConfirm: handleUpdate,
            confirmText: 'Update',
            cancelText: 'Cancel',
            color: 'warning',
          })
        }
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

      {/* Render the reusable modal */}
      {ModalComponent}
    </>
  );
};
