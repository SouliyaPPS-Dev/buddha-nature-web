import {
  AboutIcon,
  BookIcon,
  CalendarIcon,
  DhammaIcon,
  FavoritesIcon,
  Logo,
  SearchIcon,
  SutraIcon,
  VideoIcon,
} from '@/components/layouts/icons';
import { ThemeSwitch } from '@/components/layouts/theme-switch';
import { useNavigation } from '@/components/NavigationProvider';
import DownloadBook from '@/containers/book/DownloadBook';
import { ButtonUpdateData } from '@/containers/ButtonUpdateData';
import { DeleteFavorites } from '@/containers/favorites/DeleteFavorites';
import { siteConfig } from '@/layouts/site';
import { router } from '@/router';
import { localStorageData } from '@/services/cache';
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from '@heroui/navbar';
import { link as linkStyles } from '@heroui/theme';
import { Link, useRouterState } from '@tanstack/react-router';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { IoShareSocialSharp } from 'react-icons/io5';
import ImagePlayStore from './ImagePlayStore';
import { SearchDropdown } from '../search/SearchDropdown';
import { useMenuContext } from './MenuProvider';

export const Navbar = () => {
  const [activeItem, setActiveItem] = useState<string>('');
  const { isMenuOpen, setIsMenuOpen } = useMenuContext(); // Use the context
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const location = useRouterState({ select: (s) => s.location });

  const { back } = useNavigation();

  const currentPath = location.pathname;
  const pathSegments = currentPath.split('/');
  const bookViewPath = pathSegments.slice(0, -1).join('/');

  // Use useRouterState to get the current location
  const handleMobileNavigation = (href: string) => {
    router.navigate({ to: href });
    setActiveItem(href); // Set the active item when it's clicked
    setIsMenuOpen(false); // This closes the menu
  };

  const handleShare = async () => {
    const url = window.location.href;

    // Sharing the content using the Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          url, // Share a link to the content (the page with the HTML)
          text: localStorageData.getTitle() || 'Click to open',
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Sharing is not supported on this device.');
    }
  };

  useEffect(() => {
    // Update status when online/offline events occur
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <NextUINavbar
      maxWidth='xl'
      position='sticky'
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className='bg-[#795548] text-white max-h-[50px]'
    >
      {/* Back Icon Button */}
      {currentPath !== '/sutra' && (
        <div
          onClick={back}
          style={{
            position: 'relative',
            marginLeft: '-30px',
            zIndex: 999,
            cursor: 'pointer', // Show pointer cursor on hover
          }}
        >
          <button
            onClick={back}
            className='text-white mr-1'
            style={{
              padding: '10px', // Add padding for a larger clickable area
              borderRadius: '50%', // Optional: makes the button rounder
              backgroundColor: 'transparent', // Optional: maintain a transparent background
              border: 'none', // Optional: remove default button borders
            }}
          >
            <IoIosArrowBack size={24} />
          </button>
        </div>
      )}
      {/* Left: Brand and Nav Items */}
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <div className='flex items-center gap-2'>
          {/* Brand Logo */}
          <NavbarBrand className='gap-3 max-w-fit'>
            <Link
              className='flex justify-start items-center gap-1'
              color='foreground'
              href='/'
            >
              <Logo />
            </Link>
          </NavbarBrand>
        </div>
      </NavbarContent>

      {/* Right: Search, Theme Switch */}
      <NavbarContent
        className='hidden sm:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        <div className='hidden lg:flex gap-4 justify-start ml-2 mr-2 mt-1'>
          {/* {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium  text-white'
                )}
                color='foreground'
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))} */}
        </div>

        {/* Download Book Button */}
        {bookViewPath === '/book/view' && (
          <NavbarItem className='hidden sm:flex gap-2 mr-4 cursor-pointer'>
            <DownloadBook />
          </NavbarItem>
        )}

        {/* Delete Button */}
        {currentPath === '/favorites' && (
          <NavbarItem className='hidden sm:flex gap-2 mr-3 cursor-pointer'>
            <DeleteFavorites />
          </NavbarItem>
        )}

        {/* Share Button */}
        {currentPath !== '/favorites' && (
          <NavbarItem className='hidden sm:flex gap-2 mr-5 cursor-pointer'>
            <IoShareSocialSharp size={20} onClick={handleShare} />
          </NavbarItem>
        )}

        {/* Search Button */}
        <NavbarItem className='hidden sm:flex gap-2 '>
          <SearchIcon />
        </NavbarItem>

        {/* Update Data Button */}
        {isOnline && (
          <NavbarItem className='hidden sm:flex gap-2'>
            <ButtonUpdateData />
          </NavbarItem>
        )}

        {/* Theme Switch */}
        <NavbarItem className='hidden sm:flex gap-2 '>
          <ThemeSwitch />
        </NavbarItem>

        {/* Play Store */}
        <ImagePlayStore />

        {/* Conditionally hide search input when the current path is '/sutra' */}
        {currentPath !== '/sutra' && (
          <NavbarItem className='hidden lg:flex'>
            <SearchDropdown />
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile Menu Toggle */}
      <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
        {/* Download Book Button */}
        {bookViewPath === '/book/view' && (
          <div className='mr-3'>
            <DownloadBook />
          </div>
        )}

        {/* Delete Button */}
        {currentPath === '/favorites' && <DeleteFavorites />}

        {/* Share Button */}
        {!location.pathname.startsWith('/favorites') &&
          !location.pathname.startsWith('/sutra/details') && (
            <IoShareSocialSharp
              className='mr-3'
              size={20}
              onClick={handleShare}
            />
          )}

        {/* Search Button */}
        <SearchIcon />

        {/* Update Data Button */}
        {bookViewPath !== '/book/view' && <ButtonUpdateData />}

        {/* Theme Switch */}
        <ThemeSwitch />

        {/* Mobile Menu Toggle */}
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu
        style={{
          top: '50px',
        }}
      >
        <SearchDropdown />
        <div className='mx-4 mt-2 flex flex-col gap-4'>
          {siteConfig.navMenuItems.map((item, index) => {
            // Define a function or object to map items to icons
            const getIcon = (label: string) => {
              switch (label) {
                case 'ພຣະສູດ':
                  return <SutraIcon />;
                case 'ຖືກໃຈ':
                  return <FavoritesIcon />;
                case 'ປື້ມ':
                  return <BookIcon />;
                case 'Video':
                  return <VideoIcon />;
                case 'ປະຕິທິນ':
                  return <CalendarIcon />;
                case 'ພຣະທັມ':
                  return <DhammaIcon />;
                case 'ຂໍ້ມູນຕິດຕໍ່':
                  return <AboutIcon />;
                default:
                  return null;
              }
            };

            return (
              <div
                key={`${item}-${index}`}
                className='w-full'
                onClick={() => handleMobileNavigation(item.href)}
              >
                <NavbarMenuItem className='w-full'>
                  <Link
                    className={clsx(
                      linkStyles({ color: 'foreground' }),
                      'data-[active=true]:text-primary data-[active=true]:font-medium',
                      'flex items-center gap-2', // Add flex and gap for icon and label
                      activeItem === item.href
                        ? 'text-primary font-medium'
                        : '',
                      'text-4xl font-bold' // Added font-bold to make the text bold
                    )}
                    color='foreground'
                    href={item.href}
                    onClick={() => handleMobileNavigation(item.href)} // Set active item on click
                  >
                    {getIcon(item.label)} {/* Render icon */}
                    <span>{item.label}</span> {/* Menu label */}
                  </Link>
                  {/* Divider */}
                  {index !== siteConfig.navMenuItems.length - 1 && (
                    <div className='border-b my-2'></div> // Divider added between menu items
                  )}
                </NavbarMenuItem>
              </div>
            );
          })}
        </div>

        {/* Play Store */}
        <ImagePlayStore />
      </NavbarMenu>
    </NextUINavbar>
  );
};
