'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { useGetAuthUserQuery } from '@/state/api';
import { Navbar } from '@/components/navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { LoadingSpinner } from '@/components/loading-spinner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { data: authUser, isLoading: isAuthLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();

      if (
        (userRole === 'manager' && pathname.startsWith('/tenants')) ||
        (userRole === 'tenant' && pathname.startsWith('/managers'))
      ) {
        router.push(
          userRole === 'manager' ? '/managers/properties' : 'tenants/favorites',
          {
            scroll: false,
          }
        );
      }
    } else {
      setIsLoading(false);
    }
  }, [authUser, pathname, router]);

  if (isAuthLoading || isLoading) return <LoadingSpinner />;

  if (!authUser?.userRole) return null;

  return (
    <SidebarProvider>
      <div className='min-h-screen w-full bg-primary-100'>
        <Navbar />

        <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
          <main className='flex'>
            <AppSidebar userType={authUser?.userRole?.toLowerCase()} />

            <div className='flex-grow transition-all duration-300'>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
