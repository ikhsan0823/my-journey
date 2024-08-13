import React from 'react'
import { Carousels } from './Carousels';
import { DisplayImage } from './DisplayImage';

export const SweetMemory = () => {
  return (
    <div className='h-full w-full overflow-y-auto md:overflow-y-hidden scrollbar-hide flex flex-col md:flex-row'>
      <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>
        <Carousels />
      </div>
      <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>
        <DisplayImage />
      </div>
    </div>
  )
}
