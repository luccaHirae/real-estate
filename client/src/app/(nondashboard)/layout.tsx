import React from 'react';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { Navbar } from '@/components/navbar';

interface NonDashboardLayoutProps {
  children: React.ReactNode;
}

const NonDashboardLayout = ({ children }: NonDashboardLayoutProps) => {
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
