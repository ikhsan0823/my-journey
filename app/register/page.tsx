import React from 'react'
import type { Metadata } from 'next'

import { Hero } from './components/Hero'

export const metadata: Metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <div className='h-full w-full overflow-y-auto md:overflow-y-hidden scrollbar-hide flex flex-col md:flex-row'>
      <div className='w-full min-h-screen max-h-screen'>
        <Hero />
      </div>
    </div>
  );
}