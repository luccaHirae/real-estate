'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/state/redux';
import { Search } from 'lucide-react';
import { debounce } from 'lodash';
import { initialState, setFilters } from '@/state';
import { cleanParams, cn } from '@/lib/utils';
import { AmenityIcons, PropertyTypeIcons } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function FiltersFull() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const [localFilters, setLocalFilters] = useState(initialState.filters);

  const updateURL = debounce((newFilters) => {
    const cleanFilters = cleanParams(newFilters);
    const searchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      searchParams.set(
        key,
        Array.isArray(value) ? value.join(',') : value.toString()
      );
    });

    router.push(`${pathname}?${searchParams.toString()}`);
  });

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    updateURL(localFilters);
  };

  const handleResetFilters = () => {
    setLocalFilters(initialState.filters);
    dispatch(setFilters(initialState.filters));
    updateURL(initialState.filters);
  };

  const handleAmenityChange = (amenity: AmenityEnum) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleLocationSearch = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          localFilters.location
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;

        setLocalFilters((prev) => ({
          ...prev,
          coordinates: [lng, lat],
        }));
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  if (!isFiltersFullOpen) return null;

  return (
    <div className='bg-white rounded-lg px-4 h-full overflow-auto pb-10'>
      <div className='flex flex-col space-y-6'>
        {/* Location */}
        <div>
          <h4 className='font-bold mb-2'>Location</h4>
          <div className='flex items-center'>
            <Input
              placeholder='Enter location'
              value={filters.location}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className='rounded-l-xl rounded-r-none border-r-0 border-primary-400'
            />
            <Button
              onClick={handleLocationSearch}
              className='rounded-r-xl rounded-l-none border-l-0 border-black shadow-none border hover:shadow-sm hover:bg-primary-700 hover:text-primary-100'
            >
              <Search className='size-4' />
            </Button>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h4 className='font-bold mb-2'>Property Type</h4>
          <div className='grid grid-cols-2 gap-4'>
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <div
                key={type}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    propertyType: type,
                  }))
                }
                className={cn(
                  'flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer',
                  localFilters.propertyType === type
                    ? 'border-black'
                    : 'border-gray-200'
                )}
              >
                <Icon className='size-6 mb-2' />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className='font-bold mb-2'>Price Range (Monthly)</h4>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={[
              localFilters.priceRange[0] ?? 0,
              localFilters.priceRange[1] ?? 10000,
            ]}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                priceRange: value as [number, number],
              }))
            }
          />

          <div className='flex justify-between mt-2'>
            <span>${localFilters.priceRange[0] ?? 0}</span>
            <span>${localFilters.priceRange[1] ?? 10000}</span>
          </div>
        </div>

        {/* Beds and Baths */}
        <div className='flex gap-4'>
          <div className='flex-1'>
            <h4 className='font-bold mb-2'>Beds</h4>
            <Select
              value={localFilters.beds ?? 'any'}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, beds: value }))
              }
            >
              <SelectTrigger className='w-full rounded-xl border-primary-400'>
                <SelectValue placeholder='Beds' />
              </SelectTrigger>

              <SelectContent className='bg-white border-primary-400'>
                <SelectItem value='any'>Any beds</SelectItem>
                {[1, 2, 3, 4, 5].map((bed) => (
                  <SelectItem key={bed} value={bed.toString()}>
                    {bed}+ bed{bed > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex-1'>
            <h4 className='font-bold mb-2'>Baths</h4>
            <Select
              value={localFilters.baths ?? 'any'}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, baths: value }))
              }
            >
              <SelectTrigger className='w-full rounded-xl border-primary-400'>
                <SelectValue placeholder='Baths' />
              </SelectTrigger>

              <SelectContent className='bg-white border-primary-400'>
                <SelectItem value='any'>Any baths</SelectItem>
                {[1, 2, 3, 4, 5].map((bath) => (
                  <SelectItem key={bath} value={bath.toString()}>
                    {bath}+ bath{bath > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Square Feet */}
        <div>
          <h4 className='font-bold mb-2'>Square Feet</h4>
          <Slider
            min={0}
            max={5000}
            step={100}
            value={[
              localFilters.squareFeet[0] ?? 0,
              localFilters.squareFeet[1] ?? 5000,
            ]}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                squareFeet: value as [number, number],
              }))
            }
            className='[&>.bar]:bg-primary-700'
          />

          <div className='flex justify-between mt-2'>
            <span>{localFilters.squareFeet[0] ?? 0} sq ft</span>
            <span>{localFilters.squareFeet[1] ?? 5000} sq ft</span>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className='font-bold mb-2'>Amenities</h4>
          <div className='flex flex-wrap gap-2'>
            {Object.entries(AmenityIcons).map(([amenity, Icon]) => (
              <div
                key={amenity}
                onClick={() => handleAmenityChange(amenity as AmenityEnum)}
                className={cn(
                  'flex items-center space-x-2 p-2 border rounded-lg hover:cursor-pointer hover:bg-gray-100 transition-colors duration-200',
                  localFilters.amenities.includes(amenity)
                    ? 'border-black'
                    : 'border-gray-200'
                )}
              >
                <Icon className='size-5 hover:cursor-pointer' />
                <Label className='hover:cursor-pointer'>{amenity}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Available From */}
        <div>
          <h4 className='font-bold mb-2'>Available From</h4>
          <Input
            type='date'
            value={
              localFilters.availableFrom !== 'any'
                ? localFilters.availableFrom
                : ''
            }
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                availableFrom: e.target.value ? e.target.value : 'any',
              }))
            }
            className='rounded-xl border-primary-400'
          />
        </div>

        {/* Apply and Reset Buttons */}
        <div className='flex gap-4 mt-6'>
          <Button
            onClick={handleApplyFilters}
            className='flex-1 bg-primary-700 text-white rounded-xl hover:bg-primary-500 transition-colors duration-200'
          >
            Apply Filters
          </Button>

          <Button
            onClick={handleResetFilters}
            variant='outline'
            className='flex-1 rounded-xl border-primary-400 hover:bg-primary-100 transition-colors duration-200'
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
