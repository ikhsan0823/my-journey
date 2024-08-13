import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notes',
};

export default function NotesPage() {
  return (
    <div className='h-full w-full overflow-y-auto md:overflow-y-hidden scrollbar-hide flex flex-col md:flex-row'>
      <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>container 1</div>
      <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>container 2</div>
    </div>
  );
}
