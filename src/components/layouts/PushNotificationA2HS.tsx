import ios_addToHomeScreen from '@/assets/images/ios_addToHomeScreen.jpg';
import { useNavigate } from '@tanstack/react-router';
import { Button, Image } from 'antd';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isInStandaloneMode } from '@/hooks/deviceDetection';

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
  const APP_STORE_URL =
    'https://apps.apple.com/la/app/buddhaword-lao/id6751720204';
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  // (Removed mount-time redirect; now redirect happens when the toast shows)
  useEffect(() => {
    const dismissed = localStorage.getItem('a2hs_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const notify = () => {
    if (isIOSDevice() && isInStandaloneMode()) {
      navigate({
        to: '/sutra',
      });
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

          {/* App Store button image */}
          <div
            style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}
          >
            <a
              href={APP_STORE_URL}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Download on the App Store'
              style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <img
                src='https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=120x40'
                alt='Download on the App Store'
                style={{ height: 52, marginLeft: '-4px' }}
              />
            </a>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}
          >
            <Button
              type='primary'
              onClick={() => {
                localStorage.setItem('a2hs_dismissed', 'true');
                setIsVisible(false);
                toast.dismiss(); // Close the notification
              }}
              style={{ marginTop: 20, backgroundColor: '#D64550' }}
            >
              ປິດບໍ່ໃຫ້ສະແດງອີກ
            </Button>
          </div>
        </div>
      );

      // Auto-redirect to the App Store when the toast is shown (iOS Safari only)
      try {
        if (isIOSDevice() && !isInStandaloneMode()) {
          const alreadyRedirected =
            sessionStorage.getItem('iosAppRedirected') === 'true';
          if (!alreadyRedirected) {
            sessionStorage.setItem('iosAppRedirected', 'true');
            window.location.href = APP_STORE_URL;
          }
        }
      } catch (_) {
        // no-op
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      notify();
    }
  }, [isVisible]);

  // isInStandaloneMode imported from hooks/deviceDetection

  return <ToastContainer style={{ zIndex: 50 }} autoClose={15000} />;
}

export default PushNotificationA2HS;
