'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { setFilters } from '@/state';

export function Hero() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = async () => {
    try {
      const trimmedQuery = searchQuery.trim();

      if (!trimmedQuery) return;

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          trimmedQuery
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;

        dispatch(
          setFilters({
            location: trimmedQuery,
            coordinates: [lat, lng],
          })
        );

        const params = new URLSearchParams({
          location: trimmedQuery,
          lat: lat.toString(),
          lng,
        });

        router.push(`/search?${params.toString()}`);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  return (
    <section className='relative min-h-screen h-full'>
      <Image
        src='/landing-splash.jpg'
        alt='Rentiful Rental Platform Hero Section'
        fill
        className='object-cover object-center'
        priority
      />

      <div
        className='absolute inset-0 bg-black'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // 60% opacity
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full'
        >
          <div className='max-w-4xl mx-auto px-16 sm:px-12'>
            <h1 className='text-5xl font-bold text-white mb-4'>
              Start your journey to finding the perfect place to call home
            </h1>

            <p className='text-xl text-white mb-8'>
              Explore our wide range of rental properties tailored to fit your
              lifestyle and needs!
            </p>

            <div className='flex justify-center items-center'>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type='text'
                placeholder='Search by city, neighborhood or address'
                className='w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12'
              />

              <Button
                onClick={handleSearch}
                className='bg-secondary-500 text-white rounded-none rounded-r-xl border-none hover:bg-secondary-600 h-12 cursor-pointer'
              >
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
