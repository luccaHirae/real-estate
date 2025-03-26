'use client';

import React from 'react';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { Navbar } from '@/components/navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useGetAuthUserQuery } from '@/state/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { data: authUser } = useGetAuthUserQuery();

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
