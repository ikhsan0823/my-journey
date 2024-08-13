'use client'
import React from 'react'
import { useRef } from 'react'

import { FirstHero } from './FirstHero'
import { SecondHero } from './SecondHero'
import { motion } from 'framer-motion'

export const LandingPageHero = () => {
    const formRef = useRef<HTMLDivElement>(null);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    return (
        <div className='h-full w-full overflow-y-auto md:overflow-y-hidden scrollbar-hide flex flex-col md:flex-row'>
            <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>
                <div className='flex items-center justify-end sm:hidden'>
                <motion.button initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.2 }} onClick={scrollToForm} className='px-3 py-2 bg-bright-blue hover:bg-tomb-blue rounded-lg font-semibold text-sm text-soft-white'>Sign in</motion.button>
                </div>
                <FirstHero />
            </div>
            <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3 flex justify-center items-center' ref={formRef}>
                <SecondHero />
            </div>
        </div>
    )
}
