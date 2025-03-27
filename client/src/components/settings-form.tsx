'use client';

import { SettingsFormData, settingsSchema } from '@/lib/schemas';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ExtendedFormField } from '@/components/extended-form-field';

export function SettingsForm({
  initialData,
  onSubmit,
  userType,
}: SettingsFormProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);

    if (isEditMode) {
      form.reset(initialData);
    }
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await onSubmit(data);
    setIsEditMode(false);
  };

  return (
    <div className='pt-8 pb-5 px-8'>
      <div className='mb-5'>
        <h1 className='text-xl font-semibold'>{`${
          userType.charAt(0).toUpperCase() + userType.slice(1)
        } Settings`}</h1>

        <p className='text-sm text-gray-500 mt-1'>
          Manage your account preferences and personal information
        </p>
      </div>

      <div className='bg-white rounded-xl p-6'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <ExtendedFormField
              name='name'
              label='Name'
              disabled={!isEditMode}
            />
            <ExtendedFormField
              name='email'
              label='Email'
              type='email'
              disabled={!isEditMode}
            />
            <ExtendedFormField
              name='phoneNumber'
              label='Phone Number'
              disabled={!isEditMode}
            />

            <div className='pt-4 flex justify-between'>
              <Button
                type='button'
                onClick={toggleEditMode}
                className='bg-secondary-500 text-white hover:bg-secondary-600 cursor-pointer'
              >
                {isEditMode ? 'Cancel' : 'Edit'}
              </Button>

              {isEditMode && (
                <Button
                  type='submit'
                  className='bg-primary-700 text-white hover:bg-primary-800 cursor-pointer'
                >
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
