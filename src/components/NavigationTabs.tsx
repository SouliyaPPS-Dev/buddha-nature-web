import { BookIcon, CalendarIcon, SutraIcon } from '@/components/icons'; // Import icons for each tab
import { siteConfig } from '@/layouts/site';
import { Tab, Tabs } from '@nextui-org/react'; // Import NextUI Tabs
import { useRouter } from '@tanstack/react-router'; // Import useRouter hook
import React, { useEffect, useState } from 'react';

export const NavigationTabs: React.FC = () => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState(
    router.state.location.pathname
  );

  useEffect(() => {
    // Subscribe to the navigationComplete event
    const unsubscribe = router.subscribe(
      'onLoad', // Specify the event type
      ({ type, toLocation }) => {
        if (type === 'onLoad' && toLocation) {
          setCurrentPath(toLocation.pathname); // Update the current path state
        }
      }
    );

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [router]);

  // Map icons for each tab
  const tabIcons: Record<string, JSX.Element> = {
    '/sutra': <SutraIcon />,
    '/book': <BookIcon />,
    '/calendar': <CalendarIcon />,
  };

  // Determine the selected key for highlighting
  const getSelectedKey = (): string => {
    // Check if the current path exists in tabMenuItems
    const validPath = siteConfig.tabMenuItems.find(
      (item) => item.href === currentPath
    );
    return validPath ? validPath.href : '/sutra'; // Default to '/sutra' or the first valid path
  };

  return (
    <Tabs
      size='lg' // Large-sized tabs
      className='fixed bottom-4 left-1/2 transform -translate-x-1/2 px-0 py-0 rounded-lg shadow-md'
      aria-label='Dynamic Navigation Tabs'
      selectedKey={getSelectedKey()} // Dynamically highlight based on current route
      onSelectionChange={(key) => {
        if (key && typeof key === 'string' && key !== currentPath) {
          router.navigate({ to: key }); // Navigate to the selected tab's route
        }
      }}
    >
      {siteConfig.tabMenuItems.map((item) => (
        <Tab
          key={item.href}
          className='flex items-center justify-center gap-2 sm:gap-2 w-full p-3'
          title={
            <div
              className='flex items-center justify-center text-center gap-2 sm:gap-2 w-full'
              role='tab'
            >
              {/* Icon */}
              <span className='text-primary flex-shrink-0'>
                {tabIcons[item.href as string]}
              </span>
              {/* Label */}
              <span className='text-sm sm:text-base whitespace-nowrap'>
                {item.label}
              </span>
              &nbsp;
            </div>
          }
        />
      ))}
    </Tabs>
  );
};

