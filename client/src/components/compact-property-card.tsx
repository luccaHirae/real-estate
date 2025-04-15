'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Bath, Bed, Heart, House, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CompactPropertyCard({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardCompactProps) {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || '/placeholder.jpg'
  );

  return (
    <div className='bg-white rounded-xl overflow-hidden shadow-lg w-full flex h-40 mb-5'>
      <div className='relative w-1/3'>
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          onError={() => setImgSrc('/placeholder.jpg')}
        />

        <div className='absolute bottom-2 left-2 flex gap-1 flex-col'>
          {property.isPetsAllowed && (
            <span className='bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-xl w-fit'>
              Pets
            </span>
          )}

          {property.isParkingIncluded && (
            <span className='bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-xl'>
              Parking
            </span>
          )}
        </div>
      </div>

      <div className='w-2/3 p-4 flex flex-col justify-between'>
        <div>
          <div className='flex justify-between items-start'>
            <h2 className='text-xl font-bold mb-1'>
              {propertyLink ? (
                <Link
                  href={propertyLink}
                  className='hover:underline hover:text-blue-500'
                  scroll={false}
                >
                  {property.name}
                </Link>
              ) : (
                property.name
              )}
            </h2>

            {showFavoriteButton && (
              <button
                onClick={onFavoriteToggle}
                className='bg-white rounded-full p-1 cursor-pointer hover:bg-gray-100 flex items-center justify-center'
              >
                <Heart
                  className={cn(
                    'size-4',
                    isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'
                  )}
                />
              </button>
            )}
          </div>

          <p className='text-gray-600 mb-1 text-sm'>
            {property?.location?.address}, {property?.location?.city}
          </p>

          <div className='flex text-sm items-center'>
            <Star className='size-3 text-yellow-400 mr-1' />
            <span className='font-semibold'>
              {property?.averageRating?.toFixed(1)}
            </span>
            <span className='text-gray-600 ml-1'>
              ({property?.numberOfReviews})
            </span>
          </div>
        </div>

        <div className='flex justify-between items-center text-sm'>
          <div className='flex gap-2 text-gray-600'>
            <span className='flex items-center'>
              <Bed className='size-4 mr-1' />
              {property?.bedrooms}
            </span>

            <span className='flex items-center'>
              <Bath className='size-4 mr-1' />
              {property?.bathrooms}
            </span>

            <span className='flex items-center'>
              <House className='size-4 mr-1' />
              {property?.squareFeet}
            </span>
          </div>

          <p className='text-base font-bold'>
            ${property?.pricePerMonth?.toFixed(0)}{' '}
            <span className='text-gray-600 text-xs font-normal'>/ mo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
