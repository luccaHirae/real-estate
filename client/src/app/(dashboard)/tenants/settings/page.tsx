'use client';

import {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
} from '@/state/api';
import { LoadingSpinner } from '@/components/loading-spinner';
import { SettingsForm } from '@/components/settings-form';

const TenantSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateTenantSettings] = useUpdateTenantSettingsMutation();

  if (isLoading) return <LoadingSpinner />;

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateTenantSettings({
      cognitoId: authUser?.cognitoInfo.userId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType='tenant'
    />
  );
};

export default TenantSettings;
