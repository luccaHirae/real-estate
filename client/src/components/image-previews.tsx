'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ImagePreviews({ images }: ImagePreviewsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className='relative h-[450px] w-full'>
      {images.map((image, index) => (
        <div
          key={image}
          className={cn(
            'absolute inset-0 transition-opacity duration-500 ease-in-out',
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={image}
            alt={`Property image ${index + 1}`}
            fill
            priority={index === 0}
            className='object-cover transition-transform duration-500 ease-in-out'
          />
        </div>
      ))}

      <button
        onClick={handlePrevious}
        className='cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-primary-700 p-2 rounded-full focus:outline-none focus:ring focus:ring-secondary-300'
        aria-label='Previous image'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <ChevronLeft className='text-white' />
      </button>

      <button
        onClick={handleNext}
        className='cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-primary-700 p-2 rounded-full focus:outline-none focus:ring focus:ring-secondary-300'
        aria-label='Previous image'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <ChevronRight className='text-white' />
      </button>
    </div>
  );
}
