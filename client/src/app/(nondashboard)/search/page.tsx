'use client';

import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/state/redux';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { cleanParams, cn } from '@/lib/utils';
import { FiltersBar } from '@/components/filters-bar';
import { FiltersFull } from '@/components/filters-full';
import { useEffect } from 'react';
import { setFilters } from '@/state';

type Filters = {
  priceRange?: [number | null, number | null];
  squareFeet?: [number | null, number | null];
  coordinates?: number[];
  [key: string]: unknown;
};

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  useEffect(() => {
    const initialFilters: Filters = Array.from(searchParams.entries()).reduce(
      (acc, [key, value]) => {
        if (key === 'priceRange' || key === 'squareFeet') {
          acc[key] = value
            .split(',')
            .map((v) => (v === '' ? null : Number(v))) as [
            number | null,
            number | null
          ];
        } else if (key === 'coordinates') {
          acc[key] = value.split(',').map(Number);
        } else {
          acc[key] = value === 'any' ? null : value;
        }
        return acc;
      },
      {} as Filters
    );

    const cleanedFilters = cleanParams(initialFilters);
    dispatch(setFilters(cleanedFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className='w-full mx-auto px-5 flex flex-col'
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <FiltersBar />

      <div className='flex justify-between flex-1 overflow-hidden gap-3 mb-5'>
        <div
          className={cn(
            'h-full overflow-auto transition-all duration-300 ease-in-out',
            isFiltersFullOpen
              ? 'w-3/12 opacity-100 visible'
              : 'w-0 opacity-0 invisible'
          )}
        >
          <FiltersFull />
        </div>

        {/* <Map /> */}

        <div className='basis-4/12 overflow-y-auto'>{/* <Listings /> */}</div>
      </div>
    </div>
  );
};

export default SearchPage;
