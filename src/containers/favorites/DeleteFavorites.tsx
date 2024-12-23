import { useFavorites } from '@/hooks/favorites/useFavorites';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';

export const DeleteFavorites = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { refetch } = useFavorites();

  const handleDelete = () => {
    localStorage.removeItem('favorites');
    refetch();
    setIsModalOpen(false); // Close modal after deletion
  };

  return (
    <>
      <div
        style={{
          marginTop: '0.5rem',
        }}
      >
        {/* Delete Button */}
        <button
          onClick={() => setIsModalOpen(true)} // Open Modal
        >
          <MdDeleteForever className='h-6 w-6 text-red-500' />
        </button>

        {/* Confirmation Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          placement='center'
        >
          <ModalContent>
            <ModalHeader className='font-bold text-lg'>
              Confirm Delete
            </ModalHeader>
            <ModalBody>
              <p>ທ່ານຕ້ອງການລົບຂໍ້ມູນທັງໝົດບໍ່?</p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant='light'
                onClick={() => setIsModalOpen(false)}
                className='font-phetsarath'
              >
                Cancel
              </Button>
              <Button
                color='danger'
                onClick={handleDelete}
                className='font-phetsarath'
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
