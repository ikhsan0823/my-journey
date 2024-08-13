import React from 'react'
import type { Metadata } from 'next'

import { LandingPageHero } from '@/components/LandingPage'

export const metadata: Metadata = {
  title: 'Welcome to My Jurney',
};

export default function LandingPage() {
  return (
    <LandingPageHero />
  );
}
