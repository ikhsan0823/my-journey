'use client'
import React from 'react'
import { useState } from 'react';

import { FirstHero } from './FirstHero';
import { SecondHero } from './SecondHero';

export const GoalsHeroPage = () => {
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleFormSubmit = () => {
        setFormSubmitted((prev) => !prev);
    }
  return (
    <div className='h-full w-full overflow-y-auto md:overflow-y-hidden scrollbar-hide flex flex-col md:flex-row'>
      <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>
        <FirstHero onSubmitted={handleFormSubmit} />
      </div>
      <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>
        <SecondHero formSubmitted={formSubmitted} />
      </div>
    </div>
  )
}
