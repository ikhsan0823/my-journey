import React from 'react'
import type { Metadata } from 'next'
import Notes from './components/Notes';

export const metadata: Metadata = {
  title: 'Notes',
};

export default function NotesPage() {
  return (
    <div className='h-full w-full overflow-hidden scrollbar-hide flex flex-col md:flex-row'>
      <div className='w-full min-h-screen max-h-screen p-3'>
        <Notes />
      </div>
    </div>
  );
}
