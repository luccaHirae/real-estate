'use client';

import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { PropertyCard } from '@/components/property-card';
import { useGetAuthUserQuery, useGetManagerPropertiesQuery } from '@/state/api';

const Properties = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: managerProperties,
    isLoading,
    isError,
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo?.userId || '', {
    skip: !authUser?.cognitoInfo?.userId,
  });

  if (isLoading) return <Loading />;

  if (isError) return <div>Error loading properties</div>;

  return (
    <div className='dashboard-container'>
      <Header
        title='My Properties'
        subtitle='View and manager your property listings'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {managerProperties?.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isFavorite={false}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/managers/properties/${property.id}`}
          />
        ))}
      </div>

      {!managerProperties || managerProperties.length === 0 ? (
        <p>You don&apos;t have any properties listed.</p>
      ) : null}
    </div>
  );
};

export default Properties;
