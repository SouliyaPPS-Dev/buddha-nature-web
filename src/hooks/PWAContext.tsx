import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { isIOS } from './deviceDetection';

interface PWAContextType {
  showIOSPrompt: boolean;
  setShowIOSPrompt: React.Dispatch<React.SetStateAction<boolean>>;
  isIOSDevice: boolean;
  isStandalone: boolean;
  hasPromptBeenShown: boolean;
  markPromptAsShown: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [hasPromptBeenShown, setHasPromptBeenShown] = useState(false);
  const isIOSDevice = isIOS();
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://');

  useEffect(() => {
    // Check if the prompt has been shown before
    const promptShown = localStorage.getItem('iosPromptShown');

    if (promptShown) {
      setHasPromptBeenShown(true);
    }

    // Show the prompt after a delay if it's iOS, not standalone, and hasn't been shown recently
    if (isIOSDevice && !isStandalone && !promptShown) {
      const timer = setTimeout(() => {
        setShowIOSPrompt(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isIOSDevice, isStandalone]);

  const markPromptAsShown = () => {
    // Store in localStorage that we've shown the prompt
    localStorage.setItem('iosPromptShown', 'true');
    // Set expiry date (e.g., 14 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14);
    localStorage.setItem('iosPromptExpiry', expiryDate.toISOString());
    setHasPromptBeenShown(true);
  };

  useEffect(() => {
    // Check if the prompt should be shown again (expiry date passed)
    const expiryDate = localStorage.getItem('iosPromptExpiry');
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      if (new Date() > expiry) {
        // Reset if expired
        localStorage.removeItem('iosPromptShown');
        localStorage.removeItem('iosPromptExpiry');
        setHasPromptBeenShown(false);
      }
    }
  }, []);

  return (
    <PWAContext.Provider
      value={{
        showIOSPrompt,
        setShowIOSPrompt,
        isIOSDevice,
        isStandalone,
        hasPromptBeenShown,
        markPromptAsShown,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
