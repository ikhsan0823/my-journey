'use client'
import React, { useEffect, useState } from 'react'
import Carousel from '@/components/Carousel'
import { Camera, Notebook, Pencil } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios';

type Image = {
  secureUrl: string;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const SecondHero = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState({
    title: '',
    content: '',
    category: '',
    date: '',
    _id: ''
  });
  const [content, setContent] = useState<string>('');

  const fetchSlides = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/image/carousel');
      setImages(response.data.images.map((image: Image) => image.secureUrl));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      setNotes(response.data.recentNote);
      if (response.data.recentNote) {
        const truncatedContent = truncateText(response.data.recentNote.content, 100);
        setContent(truncatedContent);
      };
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSlides();
    fetchNotes();
  }, []);

  return (
    <div className='p-5 pt-10 sm:p-10 sm:pt-5'>
      <div>
        <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='text-lg font-semibold mb-3 text-dark-gray flex items-center gap-2'>
          <Camera size={24} />
          <div>Sweet Memory</div>
        </motion.div>
        {isLoading ? (
          <div className='h-64 flex justify-center items-center'>
            <div className='flex gap-2'>
              <div className='w-2 h-2 rounded-full bg-bright-blue animate-bounce [animation-delay:.7s]'></div>
              <div className='w-2 h-2 rounded-full bg-bright-blue animate-bounce [animation-delay:.2s]'></div>
              <div className='w-2 h-2 rounded-full bg-bright-blue animate-bounce [animation-delay:.7s]'></div>
            </div>
          </div>
        ) : (
          images.length > 0 ? (
            <Carousel autoSlide={true}>
              {images.map((s, i) => (
                <div key={i} className='w-full h-64 flex items-center justify-center bg-dark-gray rounded-lg'>
                  <img src={s} className='object-contain w-full h-full' />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className='h-64 flex justify-center items-center text-dark-gray/50'>
              No images available. Please upload some memories!
            </div>
          )
        )}
      </div>
      <div className='pt-7'>
        <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className='text-lg font-semibold mb-3 text-dark-gray flex items-center gap-2'>
          <Notebook size={24} />
          <div>Recent Note</div>
        </motion.div>
        {notes ? <motion.div initial={{ y: -50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className='shadow-sm bg-bright-blue mx-5 my-3 rounded-lg p-3 max-h-40 min-h-40 overflow-hidden text-dark-gray flex flex-col justify-between'>
          <div>
            <div className='font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap'>{notes?.title}</div>
            <div className='text-sm mb-5 overflow-hidden h-14 w-full'>{content}</div>
          </div>
          <div className='text-sm flex items-center justify-between'>
            <div>{new Date(notes?.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className='p-2 bg-dark-gray hover:bg-dark-grayish-blue text-soft-white rounded-full cursor-pointer'><Pencil size={15} /></div>
          </div>
        </motion.div>: 
        <div className='max-h-40 min-h-40 flex justify-center items-center text-dark-gray/50'>
          <div>No notes available. Please create a note!</div>
        </div>
        }
      </div>
    </div>
  )
}
