'use client';

import { useRouter } from 'next/navigation';
import { Phone } from 'lucide-react';
import { useGetAuthUserQuery } from '@/state/api';
import { Button } from '@/components/ui/button';

export function ContactWidget({ onOpenModal }: ContactWidgetProps) {
  const { data: authUser } = useGetAuthUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const router = useRouter();

  const handleContact = () => {
    if (authUser) {
      onOpenModal();
    } else {
      router.push('/signin');
    }
  };

  return (
    <div className='bg-white border border-primary-200 rounded-2xl p-7 h-fit min-w-[300px]'>
      {/* Contact */}
      <div className='flex items-center gap-5 mb-4 border border-primary-200 p-4 rounded-xl'>
        <div className='flex items-center p-4 bg-primary-900 rounded-full'>
          <Phone className='text-primary-50' size={15} />
        </div>

        <div>
          <p>Contact This Property</p>
          <div className='text-lg font-bold text-primary-800'>
            (424) 340-5574
          </div>
        </div>
      </div>

      <Button
        onClick={handleContact}
        className='w-full bg-primary-700 text-white hover:bg-primary-600'
      >
        {authUser ? 'Submit Application' : 'Sign In to Apply'}
      </Button>

      <hr className='my-4 opacity-15' />

      <div className='text-sm'>
        <div className='text-primary-600 mb-1'>Language: English, Bahasa.</div>
        <div className='text-primary-600'>
          Open by appointment on Monday - Friday, 9am - 5pm
        </div>
      </div>
    </div>
  );
}
