'use client';

import { HelpCircle } from 'lucide-react';
import { useGetPropertyQuery } from '@/state/api';
import { AmenityIcons, HighlightIcons } from '@/lib/constants';
import { formatEnumString } from '@/lib/utils';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PropertyDetails({ propertyId }: PropertyDetailsProps) {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <LoadingSpinner />;

  if (isError) return <div>Error loading property</div>;

  return (
    <div className='mb-6'>
      {/* Amenities */}
      <div>
        <h2 className='text-xl font-semibold my-3'>Property Amenities</h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {property.amenities.map((amenity: AmenityEnum) => {
            const Icon = AmenityIcons[amenity] || HelpCircle;

            return (
              <div
                key={amenity}
                className='flex flex-col items-center border border-gray-300 rounded-xl py-8 px-4'
              >
                <Icon className='size-8 mb-2 text-gray-700' />
                <span className='text-sm text-center text-gray-700'>
                  {formatEnumString(amenity)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights */}
      <div className='mt-12 mb-16'>
        <h3 className='text-xl font-semibold text-primary-800 dark:text-primary-100'>
          Highlights
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4 w-full'>
          {property.highlights.map((highlight: HighlightEnum) => {
            const Icon = HighlightIcons[highlight] || HelpCircle;
            return (
              <div
                key={highlight}
                className='flex flex-col items-center border border-gray-300 rounded-xl py-8 px-4'
              >
                <Icon className='w-8 h-8 mb-2 text-primary-600 dark:text-primary-300' />
                <span className='text-sm text-center text-primary-600 dark:text-primary-300'>
                  {formatEnumString(highlight)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Section */}
      <div>
        <h3 className='text-xl font-semibold text-primary-800 dark:text-primary-100 mb-5'>
          Fees and Policies
        </h3>
        <p className='text-sm text-primary-600 dark:text-primary-300 mt-2'>
          The fees below are based on community-supplied data and may exclude
          additional fees and utilities.
        </p>
        <Tabs defaultValue='required-fees' className='mt-8'>
          <TabsList className='grid w-full grid-cols-3 bg-gray-50'>
            <TabsTrigger value='required-fees'>Required Fees</TabsTrigger>
            <TabsTrigger value='pets'>Pets</TabsTrigger>
            <TabsTrigger value='parking'>Parking</TabsTrigger>
          </TabsList>
          <TabsContent value='required-fees' className='w-1/3'>
            <p className='font-semibold mt-5 mb-2'>One time move in fees</p>
            <hr className='opacity-15' />
            <div className='flex justify-between py-2 bg-secondary-50'>
              <span className='text-primary-700 font-medium'>
                Application Fee
              </span>
              <span className='text-primary-700'>
                ${property.applicationFee}
              </span>
            </div>
            <hr className='opacity-15' />
            <div className='flex justify-between py-2 bg-secondary-50'>
              <span className='text-primary-700 font-medium'>
                Security Deposit
              </span>
              <span className='text-primary-700'>
                ${property.securityDeposit}
              </span>
            </div>
            <hr className='opacity-15' />
          </TabsContent>
          <TabsContent value='pets'>
            <p className='font-semibold mt-5 mb-2'>
              Pets are {property.isPetsAllowed ? 'allowed' : 'not allowed'}
            </p>
          </TabsContent>
          <TabsContent value='parking'>
            <p className='font-semibold mt-5 mb-2'>
              Parking is{' '}
              {property.isParkingIncluded ? 'included' : 'not included'}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
