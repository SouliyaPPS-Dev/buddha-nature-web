import ios_addToHomeScreen from '@/assets/images/ios_addToHomeScreen.jpg';
import { Button, Image } from 'antd';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const isSafariBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    userAgent.includes('safari') &&
    !userAgent.includes('chrome') &&
    !userAgent.includes('android')
  );
};

export function isIOSDevice() {
  return /iPad|iPhone|iPod/i.test(navigator.userAgent);
}

function PushNotificationA2HS() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('a2hs_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const notify = () => {
    if (isIOSDevice() && isInStandaloneMode()) {
      alert('App is already installed to your home screen!');
    } else if (isSafariBrowser() && isVisible) {
      toast.info(
        <div>
          <p>
            To install this app, tap the{' '}
            <strong>
              <u>Share</u>
            </strong>{' '}
            button (
            <span role='img' aria-label='share icon'>
              ⤓
            </span>
            ) and select{' '}
            <strong>
              <u>Add to Home Screen</u>
            </strong>{' '}
            from the menu.
          </p>

          <Image
            src={ios_addToHomeScreen}
            alt='Add to Home Screen'
            preview={true}
            style={{
              marginTop: 10,
              width: '100%',
              height: 'auto',
              zIndex: 999,
            }}
          />
          <Button
            type='primary'
            onClick={() => {
              localStorage.setItem('a2hs_dismissed', 'true');
              setIsVisible(false);
              toast.dismiss(); // Close the notification
            }}
            style={{ marginTop: 10, backgroundColor: '#D64550' }}
          >
            ປິດບໍ່ໃຫ້ສະແດງອີກ
          </Button>
        </div>
      );
    }
  };

  useEffect(() => {
    if (isVisible) {
      notify();
    }
  }, [isVisible]);

  const isInStandaloneMode = () => {
    return (
      'standalone' in window.navigator && (window.navigator as any).standalone
    );
  };

  return <ToastContainer style={{ zIndex: 50 }} autoClose={15000} />;
}

export default PushNotificationA2HS;
