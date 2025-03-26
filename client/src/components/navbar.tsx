'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import { Bell, MessageCircle, Plus, Search } from 'lucide-react';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { useGetAuthUserQuery } from '@/state/api';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Navbar() {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardRoute =
    pathname.includes('/managers') || pathname.includes('/tenants');

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/'; // redirect and force a full page reload
  };

  return (
    <nav
      className='fixed top-0 left-0 w-full z-50 shadow-xl'
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className='flex justify-between items-center w-full h-full py-3 px-8 bg-primary-700 text-white'>
        <div className='flex items-center gap-4 md:gap-6'>
          {isDashboardRoute && (
            <div className='md:hidden'>
              <SidebarTrigger />
            </div>
          )}

          <Link
            href='/'
            className='cursor-pointer hover:!text-primary-300'
            scroll={false}
          >
            <div className='flex items-center gap-3'>
              <Image
                src='/logo.svg'
                alt='Rentiful Logo'
                width={24}
                height={24}
                className='size-6'
              />

              <div className='text-xl font-bold'>
                RENT
                <span className='text-secondary-500 font-light hover:!text-primary-300'>
                  IFUL
                </span>
              </div>
            </div>
          </Link>

          {isDashboardRoute && authUser && (
            <Button
              onClick={() =>
                router.push(
                  authUser.userRole.toLowerCase() === 'manager'
                    ? '/managers/newproperty'
                    : '/search'
                )
              }
              variant='secondary'
              className='md:ml-4 bg-primary-50 text-primary-700 hover:bg-primary-500 hover:text-primary-50'
            >
              {authUser.userRole.toLowerCase() === 'manager' ? (
                <>
                  <Plus className='size-4' />
                  <span className='hidden md:block ml-2'>Add New Property</span>
                </>
              ) : (
                <>
                  <Search className='size-4' />
                  <span className='hidden md:block ml-2'>
                    Search Properties
                  </span>
                </>
              )}
            </Button>
          )}
        </div>

        {!isDashboardRoute && (
          <p className='text-primary-200 hidden md:block'>
            Discover your perfect rental apartment with our advanced search
          </p>
        )}

        <div className='flex items-center gap-5'>
          {authUser ? (
            <>
              <div className='relative hidden md:block'>
                <MessageCircle className='size-6 cursor-pointer text-primary-200 hover:text-primary-400' />
                <span className='absolute top-0 right-0 size-2 bg-secondary-700 rounded-full'></span>
              </div>

              <div className='relative hidden md:block'>
                <Bell className='size-6 cursor-pointer text-primary-200 hover:text-primary-400' />
                <span className='absolute top-0 right-0 size-2 bg-secondary-700 rounded-full'></span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className='flex items-center gap-2 focus:outline-none cursor-pointer'>
                  <Avatar>
                    <AvatarImage src={authUser.userInfo?.image} />

                    <AvatarFallback className='bg-primary-600'>
                      {authUser.userRole[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <p className='text-primary-200 hidden md:block'>
                    {authUser.userInfo?.name}
                  </p>
                </DropdownMenuTrigger>

                <DropdownMenuContent className='bg-white text-primary-700'>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        authUser.userRole.toLowerCase() === 'manager'
                          ? '/managers/properties'
                          : '/tenants/favorites',
                        {
                          scroll: false,
                        }
                      )
                    }
                    className='cursor-pointer hover:!bg-primary-700 hover:!text-primary-100 font-bold'
                  >
                    Go to Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className='bg-primary-200' />

                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        `/${authUser.userRole?.toLowerCase()}s/settings`,
                        {
                          scroll: false,
                        }
                      )
                    }
                    className='cursor-pointer hover:!bg-primary-700 hover:!text-primary-100'
                  >
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className='cursor-pointer hover:!bg-primary-700 hover:!text-primary-100'
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href='/sign-in'>
                <Button
                  variant='outline'
                  className='text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg cursor-pointer'
                >
                  Sign In
                </Button>
              </Link>

              <Link href='/sign-up'>
                <Button
                  variant='secondary'
                  className='text-white border-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg cursor-pointer'
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
