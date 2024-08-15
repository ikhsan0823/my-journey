/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Camera, CircleCheck, CircleX, ImageUp, LoaderCircle, X } from 'lucide-react';
import React, { useState, useEffect, useContext } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import Carousel from '@/components/Carousel';
import { AlertContext } from '@/context/AlertContext';

type FormDatas = {
  description: string;
  date: string;
  file: FileList;
}

type Image = {
  secureUrl: string;
}

export const Carousels = ({ onSubmit }: { onSubmit: (formData: FormData, username: string) => Promise<any> }) => {
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonTitle, setButtonTitle] = useState<React.ReactNode>('Submit');

  const alertContext = useContext(AlertContext);
  if (!alertContext) return null;
  const { success, error } = alertContext;

  const errorAlert = (message: string, timeout: number) => {
      error(message, timeout);
  };

  const { username } = useAuth();

  const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const randomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const publicId = `${username}-${randomId()}`;

  const { register, handleSubmit, reset } = useForm<FormDatas>();

  const handleFormSubmit: SubmitHandler<FormDatas> = async (data) => {
    setButtonTitle(<LoaderCircle className='font-semibold w-5 h-5 animate-spin' />);
    const formData = new FormData();
    formData.append('description', data.description);
    formData.append('date', data.date);
    formData.append('publicId', publicId);
    formData.append('file', data.file[0]);

    try {
      const result = await onSubmit(formData, username!);
      const serverData = {
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        publicId: formData.get('publicId') as string,
        secureUrl: result.secure_url,
      };

      const response = await axios.post('/api/image/create', serverData);
      setButtonTitle(<CircleCheck className='font-semibold w-5 h-5' />);
      success(response.data.message, 5);
      fetchSlides();

      const triggerFetchImage = () => {
        const event = new CustomEvent('fetchImage');
        window.dispatchEvent(event);
      };
      triggerFetchImage();
      setButtonTitle('Submit');
      await delay(2000);
      closeUploadImage();
    } catch (error) {
      setButtonTitle(<CircleX className='font-semibold w-5 h-5' />);
      await delay(2000);
      setButtonTitle('Submit');
      if (axios.isAxiosError(error)) {
        errorAlert(error.response?.data.message, 5);
      } else {
        errorAlert('Something went wrong', 5);
        console.log(error);
      }
    }
  };

  const closeUploadImage = () => {
    setShowUploadImage(false);
    setSelectedImage(null);
    reset();
  };

  const fetchSlides = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/image/carousel');
      setImages(response.data.images.map((image: Image) => image.secureUrl));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
        const handleFetchSlides = () => {
            fetchSlides();
        };

        window.addEventListener('fetchSlides', handleFetchSlides);

        return () => {
            window.removeEventListener('fetchSlides', handleFetchSlides);
        };
    }, []);

  return (
    <div className='px-5 sm:px-10 pt-5 pb-5 flex flex-col w-full h-full'>
      {showUploadImage && (
        <div className='absolute top-0 left-0 w-full h-full z-50 bg-dark-gray/50'>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='bg-soft-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 shadow-md rounded-lg w-72'>
            <form onSubmit={handleSubmit(handleFormSubmit)} className='p-5 relative'>
              <X className='absolute top-2 right-2 cursor-pointer text-dark-gray/50 hover:text-dark-gray' size={15} onClick={() => closeUploadImage()} />
              <label htmlFor="file" className='h-[180px] w-full flex flex-col justify-center gap-5 cursor-pointer items-center border border-dashed rounded-lg p-6 mt-5 bg-light-gray'>
                {selectedImage ? (
                  <img src={selectedImage} alt="Uploaded" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <div className='flex items-center justify-center text-dark-gray/50'>
                    <ImageUp size={50} strokeWidth={1} />
                  </div>
                )}
                <div className='flex items-center justify-center'>
                  <span className={`text-sm text-dark-gray ${selectedImage ? 'hidden' : 'block'}`}>Choose an image</span>
                  <input type="file" id='file' {...register('file', { onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                          setSelectedImage(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }})} className='hidden' />
                </div>
              </label>
              <div className='mt-5 flex flex-col'>
                <label htmlFor="description" className='text-sm font-semibold mb-1'>Describe this moment</label>
                <textarea id="description" cols={30} rows={3} {...register('description')} className='border rounded-lg p-3 bg-transparent'></textarea>
              </div>
              <div className='flex flex-col mt-4'>
                <label htmlFor="date" className='text-sm font-semibold mb-1'>When do you get this moment</label>
                <input type="date" id="date" {...register('date')} className='border rounded-lg p-3 text-sm bg-transparent' />
              </div>
              <div className='flex justify-end mt-5'>
                <button className='bg-bright-blue text-soft-white py-2 w-20 rounded-lg text-sm font-semibold hover:bg-tomb-blue flex justify-center items-center'>
                  <div>{buttonTitle}</div>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      <div className='text-base font-semibold mb-5 flex justify-end sm:justify-start items-center'>
        <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='flex items-center gap-2 flex-row-reverse sm:flex-row'>
          <Camera size={24} />
          <div>Sweet Memory</div>
        </motion.div>
      </div>
      <div className='max-w-[683px] min-w-64 mx-auto'>
        {isLoading ? (
            <div className='w-full h-96 flex items-center justify-center rounded-lg'>
              <div className='flex gap-2'>
                <div className='w-2 h-2 rounded-full bg-bright-blue animate-bounce [animation-delay:.7s]'></div>
                <div className='w-2 h-2 rounded-full bg-bright-blue animate-bounce [animation-delay:.3s]'></div>
                <div className='w-2 h-2 rounded-full bg-bright-blue animate-bounce [animation-delay:.7s]'></div>
              </div>
            </div>
          ) : (
            <Carousel autoSlide={true}>
              {images.map((src, i) => (
                <div key={i} className='w-full h-96 flex items-center justify-center bg-dark-gray rounded-lg'>
                  <img src={src} className='object-contain w-full h-full' />
                </div>
              ))}
            </Carousel>
          )
        }
      </div>
      <div className='flex-1 w-full flex justify-center items-center'>
        <motion.button initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} onClick={() => setShowUploadImage(true)} className='bg-bright-blue text-soft-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-tomb-blue'>Upload Image</motion.button>
      </div>
    </div>
  )
}
