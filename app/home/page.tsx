import React from 'react'
import type { Metadata } from 'next'
import { FirstHero } from './components/FirstHero';
import { SecondHero } from './components/SecondHero';

export const metadata: Metadata = {
  title: 'Home',
};

export default function HomePage() {
  return (
    <div className='h-full w-full overflow-y-auto md:overflow-y-hidden scrollbar-hide flex flex-col md:flex-row'>
      <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>
        <FirstHero />
      </div>
      <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>
        <SecondHero />
      </div>
    </div>
  );
}
