'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { useGetAuthUserQuery } from '@/state/api';
import { Navbar } from '@/components/navbar';

interface NonDashboardLayoutProps {
  children: React.ReactNode;
}

const NonDashboardLayout = ({ children }: NonDashboardLayoutProps) => {
  const { data: authUser, isLoading: isAuthLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();

      if (
        (userRole === 'manager' && pathname.startsWith('/search')) ||
        (userRole === 'manager' && pathname.startsWith('/'))
      ) {
        router.push('/managers/properties', {
          scroll: false,
        });
      }
    } else {
      setIsLoading(false);
    }
  }, [authUser, pathname, router]);

  if (isAuthLoading || isLoading)
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 className='animate-spin w-10 h-10 text-secondary-600' />
      </div>
    );

  return (
    <div className='h-full w-full'>
      <Navbar />

      <main
        className='h-full w-full flex flex-col'
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default NonDashboardLayout;
