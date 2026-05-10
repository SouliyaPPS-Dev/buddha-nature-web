import ios_addToHomeScreen from '@/assets/images/ios_addToHomeScreen.jpg';
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';

function IOSInstaller({ ref, ...props }: any) {
  const APP_STORE_URL =
    'https://apps.apple.com/la/app/buddhaword-lao/id6751720204'; // TODO: replace with your App Store link
  const [isIOS, setIsIOS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone;

    if (isSafari && !isStandalone) {
      setIsIOS(true);
    }
  }, []);

  const showModal = () => {
    setIsModalOpen(true);

    // Auto-close modal after 15 seconds
    setTimeout(() => {
      setIsModalOpen(false);
    }, 15000); // 15000ms = 15 seconds
  };

  if (!isIOS) return null;

  return (
    <div
      ref={ref}
      {...props}
      className={`flex flex-wrap gap-2 items-center ${props.className || ''}`}
    >
      <Button
        radius='full'
        startContent={<IoAddCircleOutline size={20} />}
        onPress={showModal}
        className='bg-[#795548] text-white flex items-center'
      >
        Add to Home Screen
      </Button>

      {/* App Store badge */}
      <a
        href={APP_STORE_URL}
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Download on the App Store'
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <img
          src='https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=120x40'
          alt='Download on the App Store'
          style={{ height: 32 }}
        />
      </a>

      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        placement='center'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>Install App on iOS</ModalHeader>
          <ModalBody>
            <p style={{ fontSize: '16px', textAlign: 'center' }}>
              📤 Tap the <strong>Share</strong> button in Safari, then select
              <strong> "Add to Home Screen"</strong>.
            </p>
            <Image
              src={ios_addToHomeScreen}
              alt='Add to Home Screen'
              className='mt-2 w-full h-auto z-[999]'
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={() => setIsModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default IOSInstaller;
