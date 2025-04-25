'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationFormData, applicationSchema } from '@/lib/schemas';
import { useCreateApplicationMutation, useGetAuthUserQuery } from '@/state/api';
import { ExtendedFormField } from '@/components/extended-form-field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

export function ApplicationModal({
  isOpen,
  onClose,
  propertyId,
}: ApplicationModalProps) {
  const [createApplication] = useCreateApplicationMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      message: '',
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    if (!authUser || authUser.userRole !== 'tenant') {
      throw new Error('You must be logged in to apply');
    }

    await createApplication({
      ...data,
      applicationDate: new Date().toISOString(),
      status: 'Pending',
      tenantCognitoId: authUser.cognitoInfo.userId,
      propertyId,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white'>
        <DialogHeader className='mb-4'>
          <DialogTitle>Submit Application for this Property</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <ExtendedFormField
              name='name'
              label='Name'
              type='text'
              placeholder='Enter your full name'
            />

            <ExtendedFormField
              name='email'
              label='Email'
              type='email'
              placeholder='Enter your email address'
            />

            <ExtendedFormField
              name='phoneNumber'
              label='Phone Number'
              type='text'
              placeholder='Enter your phone number'
            />

            <ExtendedFormField
              name='message'
              label='Message (Optional)'
              type='textarea'
              placeholder='Enter any additional information or questions you have'
            />

            <Button type='submit' className='bg-primary-700 text-white w-full'>
              Submit Application
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
