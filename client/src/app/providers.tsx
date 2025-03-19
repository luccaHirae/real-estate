'use client';

import StoreProvider from '@/state/redux';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export default Providers;
