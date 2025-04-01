import playStoreIcon from '@/assets/images/play_store.png'; // Add a Play Store icon
import { useLinkToStore } from '@/hooks/useLinkToStore';
import { Button, Image } from 'antd';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Safari Browser Check (from the original PushNotificationA2HS file)
const isSafariBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    userAgent.includes('safari') &&
    !userAgent.includes('chrome') &&
    !userAgent.includes('android')
  );
};

// Check if the device is Huawei
const isHuaweiDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('huawei');
};

function PushNotificationPlayStore() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const checkAppInstalled = async () => {
      const dismissed = localStorage.getItem('playstore_install_dismissed');

      // Don't show notification if previously dismissed
      if (dismissed) {
        setIsVisible(false);
        return;
      }

      const isAndroid = /android/i.test(navigator.userAgent);
      const isChrome =
        /chrome/i.test(navigator.userAgent) &&
        !/edge/i.test(navigator.userAgent);

      // Check for Android + non-Safari and Chrome browsers
      if (!isSafariBrowser() || (isChrome && isAndroid)) {
        if ('getInstalledRelatedApps' in navigator) {
          try {
            const apps = await (navigator as any).getInstalledRelatedApps();
            const isInstalled = apps.some(
              (app: any) => app.id === 'com.buddha.lao_tipitaka' // Replace with your actual app ID
            );
            setIsVisible(!isInstalled);
          } catch (error) {
            console.error('Error checking installed apps:', error);
            setIsVisible(true);
          }
        } else {
          setIsVisible(true); // If the API is not supported, show the notification
        }
      }
    };

    checkAppInstalled();
  }, []);

  const { installLink } = useLinkToStore();

  const notify = () => {
    toast.info(
      <div>
        <p>
          Get the best experience by installing our app from the{' '}
          <strong>
            <u>
              {isHuaweiDevice() ? 'Google Play Store' : 'Google Play Store'}
            </u>
          </strong>
          .
        </p>

        <a href={installLink} target='_blank' rel='noopener noreferrer'>
          <Image
            src={playStoreIcon}
            alt='App Store Icon'
            preview={false}
            style={{ width: 150, height: 'auto', marginTop: 10 }}
          />
        </a>

        <div style={{ marginTop: 10 }}>
          <a href={installLink} target='_blank' rel='noopener noreferrer'>
            <Button type='primary'>Install</Button>
          </a>

          <Button
            type='default'
            onClick={() => {
              localStorage.setItem('playstore_install_dismissed', 'true');
              setIsVisible(false);
              toast.dismiss(); // Dismiss the notification
            }}
            style={{ marginLeft: 10 }}
          >
            Close
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isVisible) {
      notify();
    }
  }, [isVisible]);

  return <ToastContainer style={{ zIndex: 50 }} />;
}

export default PushNotificationPlayStore;
