/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ios_addToHomeScreen from '@/assets/images/ios_addToHomeScreen.jpg';
import { Image } from 'antd';
function PushNotificationA2HS() {
  /**
   * Function to handle "Add to Home Screen" instructions for Safari iOS users.
   */
  const notify = () => {
    // Check if the user is on iOS Safari
    if (isIOS() && isInStandaloneMode()) {
      alert('App is already installed to your home screen!');
    } else if (isSafariBrowser()) {
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
            preview={true} // Enables the full-screen preview on click
            style={{ marginTop: 10, width: '100%', height: 'auto', zIndex: 999 }}  
          />
        </div>,
        {
          autoClose: 10000, // Keep the toast visible until the user closes it
        }
      );
    } else {
      alert('This feature is only available on iOS Safari.');
    }
  };

  /**
   * Helper function to check if the browser is Safari.
   */
  const isSafariBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari =
      userAgent.includes('safari') &&
      !userAgent.includes('chrome') &&
      !userAgent.includes('android');
    return isSafari;
  };

  /**
   * Helper function to check if the platform is iOS.
   */
  const isIOS = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  /**
   * Helper to check if the app is already running in standalone mode.
   */
  const isInStandaloneMode = () => {
    return (
      'standalone' in window.navigator && (window.navigator as any).standalone
    );
  };

  useEffect(() => {
    if (isSafariBrowser() && !isInStandaloneMode()) {
      // Show toast only for Safari on iOS when the app is not already installed
      notify();
    }
  }, []); // Runs only once on component mount

  return (
    <div>
      {/* Make sure ToastContainer has a lower z-index */}
      <ToastContainer style={{ zIndex: 50 }} />
    </div>
  );
}

export default PushNotificationA2HS;
