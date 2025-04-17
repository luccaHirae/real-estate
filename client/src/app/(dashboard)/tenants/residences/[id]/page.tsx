'use client';

import { useParams } from 'next/navigation';
import {
  useGetAuthUserQuery,
  useGetLeasesQuery,
  useGetPaymentsQuery,
  useGetPropertyQuery,
} from '@/state/api';
import { Loading } from '@/components/loading';
import { ResidenceCard } from '@/components/residence-card';
import { PaymentMethod } from '@/components/payment-method';
import { BillingHistory } from '@/components/billing-history';

const Residence = () => {
  const { id } = useParams();
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: property,
    isLoading: isPropertyLoading,
    isError: isPropertyError,
  } = useGetPropertyQuery(Number(id));
  const {
    data: leases,
    isLoading: isLeasesLoading,
    isError: isLeasesError,
  } = useGetLeasesQuery(parseInt(authUser?.cognitoInfo?.userId || '0'), {
    skip: !authUser?.cognitoInfo.userId,
  });
  const {
    data: payments,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useGetPaymentsQuery(leases?.[0]?.id || 0, {
    skip: !authUser?.cognitoInfo.userId,
  });

  if (isPropertyLoading || isLeasesLoading || isPaymentsLoading)
    return <Loading />;
  if (isPropertyError || isLeasesError || isPaymentsError)
    return <div>Error loading data</div>;

  const currentLease = leases?.find(
    (lease) => lease.propertyId === property?.id
  );

  return (
    <div className='dashboard-container'>
      <div className='w-full mx-auto'>
        <div className='md:flex gap-10'>
          {currentLease && (
            <ResidenceCard property={property} currentLease={currentLease} />
          )}

          <PaymentMethod />
        </div>

        <BillingHistory payments={payments ?? []} />
      </div>
    </div>
  );
};

export default Residence;
