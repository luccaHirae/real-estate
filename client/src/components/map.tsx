'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppSelector } from '@/state/redux';
import { useGetPropertiesQuery } from '@/state/api';
import { Property } from '@/types/prisma';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function Map() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  console.log('properties', properties);

  useEffect(() => {
    if (isLoading || isError || !properties) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/luca-hirae/cm9a7642x002201qk32q2deu4',
      center: filters.coordinates || [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    properties.forEach((property) => {
      const marker = createPropertyMarker(property, map);
      const markerElement = marker.getElement();
      const path = markerElement.querySelector('path[fill="#3FB1CE"]');

      if (path) path.setAttribute('fill', '#000000');
    });

    return () => map.remove();
  }, [filters.coordinates, isError, isLoading, properties]);

  if (isLoading)
    return (
      <div className='w-full h-full flex items-center justify-center'>
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className='w-full h-full flex items-center justify-center'>
        Error loading map
      </div>
    );

  return (
    <div className='basis-5/12 grow relative rounded-xl'>
      <div
        className='map-container rounded-xl'
        ref={mapContainerRef}
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  );
}

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
          <div class="marker-popup">
            <div class="marker-popup-image"></div>
            <div>
              <a href="/search/${property.id}" target="_blank" class="marker-popup-title">
                ${property.name}
              </a>
              <p class="marker-popup-price">
                ${property.pricePerMonth}
                <span class="marker-popup-price-unit">
                  / month
                </span>
              </p>
            </div>
          </div>
        `
      )
    )
    .addTo(map);

  return marker;
};
