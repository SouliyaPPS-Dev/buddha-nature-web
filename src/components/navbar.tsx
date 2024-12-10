import { Logo } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';
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
import { SearchDropdown } from './SearchDropdown';

export const Navbar = () => {
  const [activeItem, setActiveItem] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useRouterState({ select: (s) => s.location });

  const currentPath = location.pathname;

  // Use useRouterState to get the current location

  const handleMobileNavigation = (href: string) => {
    setActiveItem(href); // Set the active item when it's clicked
    setIsMenuOpen(false); // This closes the menu
  };

  return (
    <NextUINavbar
      maxWidth='xl'
      position='sticky'
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left: Brand and Nav Items */}
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand className='gap-3 max-w-fit'>
          <Link
            className='flex justify-start items-center gap-1'
            color='foreground'
            href='/'
          >
            <Logo />
            <p className='font-bold text-inherit'>Buddhaword</p>
          </Link>
        </NavbarBrand>
        <div className='hidden lg:flex gap-4 justify-start ml-2'>
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
                )}
                color='foreground'
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      {/* Right: Search, Theme Switch */}
      <NavbarContent
        className='hidden sm:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        <NavbarItem className='hidden sm:flex gap-2'>
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
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <SearchDropdown />
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`} className='w-full'>
              <Link
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                  // Conditionally apply 'active' class to the selected item
                  activeItem === item.href ? 'text-primary font-medium' : ''
                )}
                color='foreground'
                href={item.href}
                onClick={() => handleMobileNavigation(item.href)} // Set active item on click
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
