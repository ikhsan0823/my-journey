'use client'
import React, { useEffect, useState } from 'react'
import Carousel from '@/components/Carousel'
import { Camera, Notebook, Pencil } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios';

type Image = {
  secureUrl: string;
}

export const SecondHero = () => {
  const [images, setImages] = useState<string[]>([]);

  const fetchSlides = async () => {
    try {
      const response = await axios.get('/api/image/carousel');
      setImages(response.data.images.map((image: Image) => image.secureUrl));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);
  return (
    <div className='p-5 pt-10 sm:p-10 sm:pt-5'>
      <div>
        <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='text-lg font-semibold mb-3 text-dark-gray flex items-center gap-2'>
          <Camera size={24} />
          <div>Sweet Memory</div>
        </motion.div>
        <Carousel autoSlide={true}>
          {images.map((s, i) => (
            <div key={i} className='w-full h-64 flex items-center justify-center bg-dark-gray rounded-lg'><img src={s} className='object-contain w-full h-full' /></div>
          ))}
        </Carousel>
      </div>
      <div className='pt-7'>
        <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className='text-lg font-semibold mb-3 text-dark-gray flex items-center gap-2'>
          <Notebook size={24} />
          <div>Recent Note</div>
        </motion.div>
        <motion.div initial={{ y: -50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className='shadow-sm bg-bright-blue mx-5 my-3 rounded-lg p-3 max-h-40 min-h-40 overflow-hidden text-dark-gray flex flex-col justify-between'>
          <div>
            <div className='font-semibold mb-2'>Notes Title</div>
            <div className='text-sm mb-5'>Notes Description</div>
          </div>
          <div className='text-sm flex items-center justify-between'>
            <div>August 1, 2024</div>
            <div className='p-2 bg-dark-gray hover:bg-dark-grayish-blue text-soft-white rounded-full cursor-pointer'><Pencil size={15} /></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
