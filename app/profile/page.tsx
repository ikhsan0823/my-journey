import React from 'react'
import type { Metadata } from 'next'
import Profile from './components/Profile';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  return (
    <div className='h-full w-full overflow-y-auto md:overflow-y-hidden scrollbar-hide flex flex-col'>
      <div className='w-full min-h-screen max-h-screen p-3'>
        <Profile />
      </div>
    </div>
  );
}
