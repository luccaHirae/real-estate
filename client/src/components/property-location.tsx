'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { Compass, MapPin } from 'lucide-react';
import { useGetPropertyQuery } from '@/state/api';
import { LoadingSpinner } from '@/components/loading-spinner';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function PropertyLocation({ propertyId }: PropertyLocationProps) {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || isError || !property) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/luca-hirae/cm9a7642x002201qk32q2deu4',
      center: [
        property.location.coordinates.longitude,
        property.location.coordinates.latitude,
      ], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    const marker = new mapboxgl.Marker()
      .setLngLat([
        property.location.coordinates.longitude,
        property.location.coordinates.latitude,
      ])
      .addTo(map);

    const markerElement = marker.getElement();
    const path = markerElement.querySelector('path[fill="#3FB1CE"]');
    if (path) path.setAttribute('fill', '#000000');

    return () => map.remove();
  }, [isError, isLoading, property]);

  if (isLoading) return <LoadingSpinner />;

  if (isError) return <div>Error loading property</div>;

  return (
    <div className='py-16'>
      <h3 className='text-xl font-semibold text-primary-600 dark:text-primary-100'>
        Map and Location
      </h3>

      <div className='flex justify-between items-center text-sm text-primary-500 mt-2'>
        <div className='flex items-center text-gray-500'>
          <MapPin className='size-4 mr-1 text-gray-700' />
          Property Address:
          <span className='ml-2 font-semibold text-gray-700'>
            {property.location?.address || 'Address not available'}
          </span>
        </div>

        <a
          href={`http://maps.google.com/?q=${encodeURIComponent(
            property.location?.address || ''
          )}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex justify-between items-center hover:underline gap-2 text-primary-500'
        >
          <Compass className='size-5' />
          Get Directions
        </a>
      </div>

      <div
        className='relative mt-4 h-[300px] rounded-lg overflow-hidden'
        ref={mapContainerRef}
      />
    </div>
  );
}
