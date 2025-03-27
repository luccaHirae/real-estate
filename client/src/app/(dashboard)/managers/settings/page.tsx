'use client';

import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
} from '@/state/api';
import { LoadingSpinner } from '@/components/loading-spinner';
import { SettingsForm } from '@/components/settings-form';

const ManagerSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateManagerSettings] = useUpdateManagerSettingsMutation();

  if (isLoading) return <LoadingSpinner />;

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateManagerSettings({
      cognitoId: authUser?.cognitoInfo.userId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType='manager'
    />
  );
};

export default ManagerSettings;
