import {
  AboutIcon,
  BookIcon,
  CalendarIcon,
  DhammaIcon,
  Logo,
  SutraIcon,
  VideoIcon,
} from '@/components/layouts/icons';
import { ThemeSwitch } from '@/components/layouts/theme-switch';
import { useNavigation } from '@/components/NavigationProvider';
import { ButtonUpdateData } from '@/containers/sutra/ButtonUpdateData';
import { siteConfig } from '@/layouts/site';
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from '@nextui-org/navbar';
import { link as linkStyles } from '@nextui-org/theme';
import { Link, useRouterState } from '@tanstack/react-router';
import clsx from 'clsx';
import { useState } from 'react';
import { SearchProvider } from '../search/SearchContext';
import { SearchDropdown } from '../search/SearchDropdown';
import { useMenuContext } from './MenuProvider';
import { IoIosArrowBack } from 'react-icons/io';

export const Navbar = () => {
  const [activeItem, setActiveItem] = useState<string>('');
  const { isMenuOpen, setIsMenuOpen } = useMenuContext(); // Use the context

  const location = useRouterState({ select: (s) => s.location });

  const { back } = useNavigation();

  const currentPath = location.pathname;

  // Use useRouterState to get the current location
  const handleMobileNavigation = (href: string) => {
    setActiveItem(href); // Set the active item when it's clicked
    setIsMenuOpen(false); // This closes the menu
  };

  return (
    <SearchProvider>
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
              marginLeft: '-20px',
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
            {siteConfig.navItems.map((item) => (
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
            ))}
          </div>

          <NavbarItem className='hidden sm:flex gap-2 '>
            <ButtonUpdateData />
          </NavbarItem>

          <NavbarItem className='hidden sm:flex gap-2 '>
            <ThemeSwitch />
          </NavbarItem>
          {/* Conditionally hide search input when the current path is '/sutra' */}
          {currentPath !== '/sutra' && (
            <NavbarItem className='hidden lg:flex'>
              <SearchDropdown />
            </NavbarItem>
          )}
        </NavbarContent>
        {/* Mobile Menu Toggle */}
        <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
          <ButtonUpdateData />
          <ThemeSwitch />
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
                <NavbarMenuItem key={`${item}-${index}`} className='w-full'>
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
                </NavbarMenuItem>
              );
            })}
          </div>
        </NavbarMenu>
      </NextUINavbar>
    </SearchProvider>
  );
};
