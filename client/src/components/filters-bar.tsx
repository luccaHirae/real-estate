'use client';

import { useState } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/state/redux';
import { setFilters, setViewMode, toggleFiltersFullOpen } from '@/state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cleanParams, cn, formatPriceValue } from '@/lib/utils';
import { PropertyTypeIcons } from '@/lib/constants';

export function FiltersBar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [search, setSearch] = useState(filters.location);

  const updateURL = debounce(
    (newFilters) => {
      const cleanFilters = cleanParams(newFilters);
      const searchParams = new URLSearchParams();

      Object.entries(cleanFilters).forEach(([key, value]) => {
        searchParams.set(
          key,
          Array.isArray(value) ? value.join(',') : value.toString()
        );
      });

      router.push(`${pathname}?${searchParams.toString()}`);
    },
    500,
    { leading: false, trailing: true }
  );

  const handleFilterChange = (
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    isMin: boolean | null
  ) => {
    let newValue = value;

    if (key === 'priceRange' || key === 'squareFeet') {
      const currentArrayRange = [...filters[key]];

      if (isMin !== null) {
        const index = isMin ? 0 : 1;
        currentArrayRange[index] = value === 'any' ? null : Number(value);
      }

      newValue = currentArrayRange;
    } else if (key === 'coordinates') {
      newValue = value === 'any' ? [0, 0] : value.map(Number);
    } else {
      newValue = value === 'any' ? null : value;
    }

    const newFilters = {
      ...filters,
      [key]: newValue,
    };

    dispatch(setFilters(newFilters));
    updateURL(newFilters);
  };

  return (
    <div className='flex justify-between items-center w-full py-5'>
      {/* Filters */}
      <div className='flex justify-between items-center gap-4 p-2'>
        {/* All Filters */}
        <Button
          variant='outline'
          className={cn(
            'gap-2 rounded-xl border-primary-400 hover:bg-primary-500 hover:text-primary-100',
            isFiltersFullOpen && 'bg-primary-700 text-primary-100'
          )}
          onClick={() => dispatch(toggleFiltersFullOpen())}
        >
          <Filter className='size-4' />
          <span>All Filters</span>
        </Button>

        {/* Search Location */}
        <div className='flex items-center'>
          <Input
            placeholder='Search location'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-40 rounded-l-xl rounded-r-none border-primary-400 border-r-0'
          />
          <Button
            // onClick={handleLocationSearch}
            className='rounded-r-xl rounded-l-none border-l-none border-primary-400 shadow-none border hover:bg-primary-700 hover:text-primary-50'
          >
            <Search className='size-4' />
          </Button>
        </div>

        {/* Price Range */}
        <div className='flex gap-1'>
          {/* Minimum Price Selector */}
          <Select
            value={filters.priceRange[0]?.toString() ?? 'any'}
            onValueChange={(value) =>
              handleFilterChange('priceRange', value, true)
            }
          >
            <SelectTrigger className='w-36 rounded-xl border-primary-400'>
              <SelectValue>
                {formatPriceValue(filters.priceRange[0], true)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value='any'>Any Min Price</SelectItem>
              {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  ${price / 1000}k+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Maximum Price Selector */}
          <Select
            value={filters.priceRange[1]?.toString() ?? 'any'}
            onValueChange={(value) =>
              handleFilterChange('priceRange', value, false)
            }
          >
            <SelectTrigger className='w-36 rounded-xl border-primary-400'>
              <SelectValue>
                {formatPriceValue(filters.priceRange[1], false)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value='any'>Any Max Price</SelectItem>
              {[1000, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  &lt;${price / 1000}k
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Beds and Baths */}
        <div className='flex gap-1'>
          {/* Beds */}
          <Select
            value={filters.beds}
            onValueChange={(value) => handleFilterChange('beds', value, null)}
          >
            <SelectTrigger className='w-28 rounded-xl border-primary-400'>
              <SelectValue placeholder='Beds' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value='any'>Any Beds</SelectItem>
              {[1, 2, 3, 4].map((bed) => (
                <SelectItem key={bed} value={bed.toString()}>
                  {bed}+ {bed > 1 ? 'beds' : 'bed'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Baths */}
          <Select
            value={filters.baths}
            onValueChange={(value) => handleFilterChange('baths', value, null)}
          >
            <SelectTrigger className='w-28 rounded-xl border-primary-400'>
              <SelectValue placeholder='Baths' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value='any'>Any Baths</SelectItem>
              {[1, 2, 3].map((bath) => (
                <SelectItem key={bath} value={bath.toString()}>
                  {bath}+ {bath > 1 ? 'baths' : 'bath'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <Select
          value={filters.propertyType ?? 'any'}
          onValueChange={(value) =>
            handleFilterChange('propertyType', value, null)
          }
        >
          <SelectTrigger className='w-44 rounded-xl border-primary-400'>
            <SelectValue placeholder='Home Type' />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectItem value='any'>Any Property Type</SelectItem>
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <SelectItem key={type} value={type}>
                <div className='flex items-center'>
                  <Icon className='size-4 mr-2' />
                  <span>{type}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Mode */}
      <div className='flex justify-between items-center gap-4 p-2'>
        <div className='flex border rounded-xl border-primary-200'>
          <Button
            variant='ghost'
            className={cn(
              'px-3 py-1 rounded-none rounded-l-xl hover:bg-primary-600 hover:text-primary-50',
              viewMode === 'list' ? 'bg-primary-700 text-primary-50' : ''
            )}
            onClick={() => dispatch(setViewMode('list'))}
          >
            <List className='size-5' />
          </Button>

          <Button
            variant='ghost'
            className={cn(
              'px-3 py-1 rounded-none rounded-r-xl hover:bg-primary-600 hover:text-primary-50',
              viewMode === 'grid' ? 'bg-primary-700 text-primary-50' : ''
            )}
            onClick={() => dispatch(setViewMode('grid'))}
          >
            <Grid className='size-5' />
          </Button>
        </div>
      </div>
    </div>
  );
}
