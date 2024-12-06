import { useTheme } from '@/hooks/use-theme';
import React from 'react';

// Custom hook to detect screen size
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener); // Use addEventListener for better compatibility
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
};

export const Loading: React.FC = () => {
  const { theme } = useTheme(); // Access the global theme
  const isMobile = useMediaQuery('(max-width: 768px)'); // Define mobile breakpoint

  // Determine which image to show based on the screen size
  const backgroundImage = isMobile
    ? '/images/loading/loading_mobile.jpg'
    : '/images/loading/loading_desktop_tablet.jpg';

  return (
    <div
      style={{
        position: 'fixed', // Ensure the image stays in place
        top: 0,
        left: 0,
        width: '100vw', // Full viewport width
        height: '100vh', // Full viewport height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme === 'light' ? '#F6EFD9' : '#1a202c', // Adjust background based on theme
        backgroundImage: `url(${backgroundImage})`, // Apply the image as a background
        backgroundSize: 'cover', // Ensures the image covers the entire viewport while preserving its aspect ratio
        backgroundPosition: 'center', // Keeps the image centered
        backgroundRepeat: 'no-repeat', // Prevents background tiling
        zIndex: 9999, // Ensure it is above other content
      }}
    />
  );
};
