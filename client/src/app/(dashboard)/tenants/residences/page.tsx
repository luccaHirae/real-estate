'use client';

import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { PropertyCard } from '@/components/property-card';
import {
  useGetAuthUserQuery,
  useGetCurrentResidencesQuery,
  useGetTenantQuery,
} from '@/state/api';

const Residences = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || '',
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  );
  const {
    data: currentResidences,
    isLoading,
    isError,
  } = useGetCurrentResidencesQuery(authUser?.cognitoInfo?.userId || '', {
    skip: !authUser?.cognitoInfo?.userId,
  });

  if (isLoading) return <Loading />;

  if (isError) return <div>Error loading current residences</div>;

  return (
    <div className='dashboard-container'>
      <Header
        title='Current Residences'
        subtitle='View and manage your current living spaces'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {currentResidences?.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isFavorite={tenant?.favorites?.includes(property.id) || false}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/tenants/residences/${property.id}`}
          />
        ))}
      </div>

      {!currentResidences || currentResidences.length === 0 ? (
        <p>You don&apos;t have any current residences.</p>
      ) : null}
    </div>
  );
};

export default Residences;
