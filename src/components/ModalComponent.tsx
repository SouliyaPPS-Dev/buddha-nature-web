import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { ReactNode, useState } from 'react';

interface ConfirmationModalOptions {
  title?: string;
  message?: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  color?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
}

interface UseConfirmationModalReturn {
  isModalOpen: boolean;
  openModal: (options: ConfirmationModalOptions) => void;
  closeModal: () => void;
  ModalComponent: ReactNode;
  color?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
}

export const useConfirmationModal = (): UseConfirmationModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ConfirmationModalOptions>({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  });

  const openModal = (options: ConfirmationModalOptions) => {
    setModalOptions({
      title: options.title || 'Confirm Action',
      message: options.message || 'Are you sure you want to proceed?',
      onConfirm: options.onConfirm,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      color: options.color,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const ModalComponent = (
    <Modal isOpen={isModalOpen} onClose={closeModal} placement='center'>
      <ModalContent>
        <ModalHeader className='font-bold text-lg'>
          {modalOptions.title}
        </ModalHeader>
        <ModalBody>
          <p>{modalOptions.message}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant='light'
            onClick={closeModal}
            className='font-phetsarath'
          >
            {modalOptions.cancelText}
          </Button>
          <Button
            color={modalOptions.color || 'primary'}
            onClick={() => {
              modalOptions.onConfirm?.();
              closeModal();
            }}
            className='font-phetsarath'
          >
            {modalOptions.confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return {
    isModalOpen,
    openModal,
    closeModal,
    ModalComponent,
    color: modalOptions.color || 'primary',
  };
};
