'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export const FirstHero = () => {
  return (
    <div className='mt-10 sm:mt-20 px-5 sm:pl-14 sm:px-5'>
        <motion.h2 initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='text-3xl font-semibold text-bright-blue mb-5'>Welcome to My Journey</motion.h2>
        <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className='text-dark-gray text-xl font-medium mb-2'>Plan, Track, and Celebrate Your Life Journey</motion.div>
        <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className='text-dark-gray text-base mb-6'>Do you want to be more organized in your daily life? Do you have goals to achieve and sweet memories to preserve? My Journey is the perfect platform to help you plan, track, and celebrate every step of your life journey. With features such as To-Do List, Monthly Plan, Goals, and Sweet Memory Gallery, you can manage your daily activities easily and efficiently.</motion.div>
        <Link href="/register"><motion.button initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.2 }} className='py-2 px-3 rounded-lg bg-bright-blue hover:bg-tomb-blue font-semibold text-sm text-soft-white'>Get Started</motion.button></Link>
    </div>
  )
}
