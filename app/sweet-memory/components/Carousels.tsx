'use client';

import { Camera, ImageUp, X } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import Carousel from '@/components/Carousel';

type FormData = {
  description: string;
  date: string;
  file: FileList;
}

type Image = {
  file: string;
}

export const Carousels = () => {
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log(data);
      const formData = new FormData();
      formData.append('description', data.description);
      formData.append('date', data.date);
      formData.append('file', data.file[0]);

      const response = await axios.post('/api/image/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      fetchSlides();
    } catch (error) {
      console.log(error);
    }
  };

  const closeUploadImage = () => {
    setShowUploadImage(false);
    setSelectedImage(null);
    reset();
  };

  const fetchSlides = async () => {
    try {
      const response = await axios.get('/api/image');
      setImages(response.data.images.map((image: Image) => image.file));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  return (
    <div className='px-5 sm:px-10 pt-5 pb-5 flex flex-col w-full h-full'>
      {showUploadImage && (
        <div className='bg-soft-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 shadow-md rounded-lg w-72'>
          <form onSubmit={handleSubmit(onSubmit)} className='p-5 relative'>
            <X className='absolute top-2 right-2 cursor-pointer text-dark-gray/50 hover:text-dark-gray' size={15} onClick={() => closeUploadImage()} />
            <label htmlFor="file" className='h-[180px] w-full flex flex-col justify-center gap-5 cursor-pointer items-center border border-dashed rounded-lg p-6 mt-5'>
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
              <button className='bg-bright-blue text-soft-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-tomb-blue'>Submit</button>
            </div>
          </form>
        </div>
      )}
      <div className='text-base font-semibold mb-5 flex justify-end sm:justify-start items-center'>
        <div className='flex items-center gap-2 flex-row-reverse sm:flex-row'>
          <Camera size={24} />
          <div>Sweet Memory</div>
        </div>
      </div>
      <div>
        <Carousel autoSlide={true}>
          {images.map((src, i) => (
            <div key={i} className='w-full h-64 flex items-center justify-center bg-dark-gray rounded-lg'>
              <img src={src} className='object-contain w-full h-full' />
            </div>
          ))}
        </Carousel>
      </div>
      <div className='flex-1 w-full flex justify-center items-center'>
        <button onClick={() => setShowUploadImage(true)} className='bg-bright-blue text-soft-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-tomb-blue'>Upload Image</button>
      </div>
    </div>
  )
}
