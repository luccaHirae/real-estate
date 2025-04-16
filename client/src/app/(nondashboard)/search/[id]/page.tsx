'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
// import { useGetAuthUserQuery } from '@/state/api';
import { ImagePreviews } from '@/components/image-previews';
import { PropertyOverview } from '@/components/property-overview';
import { PropertyDetails } from '@/components/property-details';
import { PropertyLocation } from '@/components/property-location';
import { ContactWidget } from '@/components/contact-widget';

const SingleListing = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  // const { data: authUser } = useGetAuthUserQuery(undefined, {
  //   refetchOnMountOrArgChange: true,
  // });
  const [, setIsModalOpen] = useState(false);

  return (
    <div>
      <ImagePreviews
        images={['/singlelisting-2.jpg', '/singlelisting-3.jpg']}
      />

      <div className='flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8'>
        <div className='order-2 md:order-1'>
          <PropertyOverview propertyId={propertyId} />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>

        <div className='order-1 md:order-2'>
          <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>
    </div>
  );
};

export default SingleListing;
