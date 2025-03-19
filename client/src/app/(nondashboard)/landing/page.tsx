import React from 'react';
import { Hero } from '@/app/(nondashboard)/landing/components/hero';
import { Features } from '@/app/(nondashboard)/landing/components/features';
import { Discover } from '@/app/(nondashboard)/landing/components/discover';
import { CallToAction } from '@/app/(nondashboard)/landing/components/call-to-action';
import { Footer } from '@/app/(nondashboard)/landing/components/footer';

const Landing = () => {
  return (
    <>
      <Hero />
      <Features />
      <Discover />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Landing;
