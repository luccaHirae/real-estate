'use client';

import { useParams } from 'next/navigation';
// import { useGetAuthUserQuery } from '@/state/api';
import { ImagePreviews } from '@/components/image-previews';
import { PropertyOverview } from '@/components/property-overview';
import { PropertyDetails } from '@/components/property-details';

const SingleListing = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  // const { data: authUser } = useGetAuthUserQuery(undefined, {
  //   refetchOnMountOrArgChange: true,
  // });

  return (
    <div>
      <ImagePreviews
        images={['/singlelisting-2.jpg', '/singlelisting-3.jpg']}
      />

      <div className='flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8'>
        <div className='order-2 md:order-1'>
          <PropertyOverview propertyId={propertyId} />

          <PropertyDetails propertyId={propertyId} />
        </div>
      </div>
    </div>
  );
};

export default SingleListing;
