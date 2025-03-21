'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import StoreProvider from '@/state/redux';
import Auth from '@/app/(auth)/auth-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <StoreProvider>
      <Authenticator.Provider>
        <Auth>{children}</Auth>
      </Authenticator.Provider>
    </StoreProvider>
  );
};

export default Providers;
