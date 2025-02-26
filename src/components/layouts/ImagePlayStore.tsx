import playStoreIcon from '@/assets/images/play_store.png'; // Add a Play Store icon
import { useLinkToStore } from '@/hooks/useLinkToStore';
import { NavbarItem } from '@heroui/navbar';
import { Image } from 'antd';
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
    <NavbarItem className='hidden sm:flex gap-2'>
      <a href={installLink} target='_blank' rel='noopener noreferrer'>
        <Image
          src={playStoreIcon}
          alt='Google Play Store Icon'
          preview={false}
          style={{ width: 150, height: 'auto', marginTop: 10 }}
        />
      </a>
    </NavbarItem>
  );
};

export default ImagePlayStore;
