import { useConfirmationModal } from '@/components/ModalComponent';
import { useFavorites } from '@/hooks/favorites/useFavorites';
import { MdDeleteForever } from 'react-icons/md';

export const DeleteFavorites = () => {
  const { refetch } = useFavorites();
  const { openModal, ModalComponent } = useConfirmationModal();

  const handleDelete = () => {
    localStorage.removeItem('favorites');
    refetch();
  };

  return (
    <>
      <div style={{ marginTop: '0.5rem' }}>
        {/* Delete Button */}
        <button
          onClick={() =>
            openModal({
              title: 'Confirm Delete',
              message: 'ທ່ານຕ້ອງການລົບຂໍ້ມູນທັງໝົດບໍ່?',
              onConfirm: handleDelete,
              confirmText: 'Delete',
              cancelText: 'Cancel',
              color: 'danger',
            })
          }
        >
          <MdDeleteForever className='h-6 w-6 text-red-500' />
        </button>
      </div>

      {/* Render the reusable modal */}
      {ModalComponent}
    </>
  );
};
