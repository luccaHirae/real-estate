import React from 'react';
import { Hero } from '@/app/(nondashboard)/landing/components/hero';
import { Features } from '@/app/(nondashboard)/landing/components/features';
import { Discover } from '@/app/(nondashboard)/landing/components/discover';

const Landing = () => {
  return (
    <>
      <Hero />
      <Features />
      <Discover />
    </>
  );
};

export default Landing;
