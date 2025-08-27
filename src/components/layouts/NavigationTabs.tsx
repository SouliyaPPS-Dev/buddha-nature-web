import {
  BookIcon,
  CalendarIcon,
  DhammaIcon,
  SutraIcon,
  VideoIcon,
  FavoritesIcon,
  AboutIcon,
} from '@/components/layouts/icons'; // Import icons for each tab
import { siteConfig } from '@/layouts/site';
import { Tab, Tabs } from "@heroui/react"; // Import NextUI Tabs
import { useRouter, useRouterState } from '@tanstack/react-router'; // Import useRouter hook
import clsx from 'clsx';
import React from 'react';

export const NavigationTabs: React.FC = () => {
  const router = useRouter();
  const location = useRouterState({ select: (s) => s.location });
  const currentPath = location.pathname;

  // Map icons for each tab
  const tabIcons: Record<string, JSX.Element> = {
    '/sutra': <SutraIcon />,
    '/favorites': <FavoritesIcon />,
    '/book': <BookIcon />,
    '/video': <VideoIcon />,
    '/dhamma': <DhammaIcon />,
    '/calendar': <CalendarIcon />,
    '/about': <AboutIcon />,
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
      className='fixed bottom-0 left-1/2 transform -translate-x-1/2 px-0 py-0 rounded-lg shadow-md z-20'
      aria-label='Dynamic Navigation Tabs'
      selectedKey={getSelectedKey()} // Dynamically highlight based on the current route
      onSelectionChange={(key) => {
        if (key && typeof key === 'string' && key !== currentPath) {
          router.navigate({ to: key }); // Navigate to the selected tab's route
        }
      }}
    >
      {siteConfig.tabMenuItems.map((item) => (
        <Tab
          key={item.href}
          className='flex items-center justify-center w-full px-2 py-6'
          title={
            <div
              className='flex flex-col items-center justify-center text-center'
              role='tab'
            >
              {/* Icon */}
              <span className='mb-1 text-primary flex-shrink-0 w-10'>
                {tabIcons[item.href as string]}
              </span>
              {/* Label */}
              <span
                className={clsx(
                  'text-xs sm:text-sm whitespace-nowrap',
                  // Apply font-bold when the tab is selected
                  getSelectedKey() === item.href ? 'font-bold' : ''
                )}
              >
                {item.label}
              </span>
            </div>
          }
        />
      ))}
    </Tabs>
  );
};
