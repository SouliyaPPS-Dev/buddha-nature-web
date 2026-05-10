import playStoreIcon from '@/assets/images/play_store.png'; // Add a Play Store icon
import { useLinkToStore } from '@/hooks/useLinkToStore';
import { Image } from '@heroui/react';
import { useEffect, useState } from 'react';
import { isIOSDevice, isSafariBrowser } from './PushNotificationA2HS';

const ImagePlayStore = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const { installLink } = useLinkToStore();

  useEffect(() => {
    setIsIOS(isIOSDevice());
    setIsSafari(isSafariBrowser());
  }, []);

  if (isIOS || isSafari) return null; // Don't render on iOS or Safari

  return (
    <a href={installLink} target='_blank' rel='noopener noreferrer'>
      <Image
        src={playStoreIcon}
        alt='Google Play Store Icon'
        className='w-[150px] h-auto mt-2'
      />
    </a>
  );
};

export default ImagePlayStore;
