'use client';

import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from '@/state/api';
import { useAppSelector } from '@/state/redux';
import { Property } from '@/types/prisma';
import { PropertyCard } from '@/components/property-card';
import { CompactPropertyCard } from '@/components/compact-property-card';

export function Listings() {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo.userId || '',
    {
      skip: !authUser?.cognitoInfo.userId,
    }
  );
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const handleToggleFavorite = async (propertyId: string) => {
    if (!authUser) return;

    const isFavorite = tenant?.favorites.some(
      (property: Property) => property.id === propertyId
    );

    if (isFavorite) {
      await removeFavorite({
        cognitoId: authUser.cognitoInfo.userId,
        propertyId,
      });
    } else {
      await addFavorite({
        cognitoId: authUser.cognitoInfo.userId,
        propertyId,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading properties</div>;

  return (
    <div className='w-full'>
      <h3 className='text-sm px-4 font-bold'>
        {properties?.length}{' '}
        <span className='text-gray-700 font-normal'>
          Places in {filters.location}
        </span>
      </h3>

      <div className='flex'>
        <div className='p-4 w-full'>
          {properties?.map((property) =>
            viewMode === 'grid' ? (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={
                  tenant?.favorites.some(
                    (favorite: Property) => favorite.id === property.id
                  ) ?? false
                }
                onFavoriteToggle={() => handleToggleFavorite(property.id)}
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.id}`}
              />
            ) : (
              <CompactPropertyCard
                key={property.id}
                property={property}
                isFavorite={
                  tenant?.favorites.some(
                    (favorite: Property) => favorite.id === property.id
                  ) ?? false
                }
                onFavoriteToggle={() => handleToggleFavorite(property.id)}
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.id}`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
