import React from 'react'
import type { Metadata } from 'next'
import SettingsComponent from './components/Settings';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className='h-full w-full overflow-hidden scrollbar-hide flex flex-col'>
      <div className='w-full min-h-screen max-h-screen p-3'>
        <SettingsComponent />
      </div>
    </div>
  );
}
