'use client';

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Trash, X } from 'lucide-react';
import { AlertContext } from '@/context/AlertContext';

type Image = {
    _id: string;
    description: string;
    date: Date;
    publicId: string;
    secureUrl: string;
}

export const DisplayImage = () => {
    const [image, setImages] = useState<Image[]>([])
    const [showImage, setShowImage] = useState(false)
    const [selectedImage, setSelectedImage] = useState<Image | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const alertContext = React.useContext(AlertContext)
    if (!alertContext) return null
    const { success, error } = alertContext

    const errorAlert = (message: string, timeout: number) => {
      error(message, timeout);
    }

    const fetchImage = async () => {
        setIsLoading(true)
        const response = await axios.get('/api/image')
        setImages(response.data.images)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchImage()
    }, [])

    useEffect(() => {
        const handleFetchImage = () => {
            fetchImage();
        };

        window.addEventListener('fetchImage', handleFetchImage);

        return () => {
            window.removeEventListener('fetchImage', handleFetchImage);
        };
    }, []);

    const handleImageClick = (image: Image) => {
        setSelectedImage(image)
        setShowImage(true)
    }

    const handleDeleteImage = async (image: Image) => {
        try {
            const response = await axios.delete(`/api/image/${image.publicId}`)
            success(response.data.message, 5)
            const triggerFetchSlides = () => {
                const event = new CustomEvent('fetchSlides');
                window.dispatchEvent(event);
            };
            triggerFetchSlides()
            fetchImage()
            setShowImage(false)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                errorAlert(error.response?.data.message, 5)
            } else {
                errorAlert('Something went wrong', 5)
            }
        }
    }
  return (
    <div className='px-5 sm:px-10 pt-14 sm:pt-5 pb-5 flex flex-col w-full h-full overflow-hidden'>
        {showImage && selectedImage && (
            <div className='fixed top-0 left-0 w-full h-full bg-dark-gray/50 z-50 flex items-center justify-center'>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className='bg-soft-white h-[calc(100%-20px)] w-[calc(100%-20px)] lg:h-[calc(100%-3rem)] lg:w-[calc(100%-3rem)] rounded-lg relative'>
                    <X className='absolute top-1 right-1 cursor-pointer text-dark-gray/50 hover:text-dark-gray' size={15} onClick={() => setShowImage(false)} />
                    <Trash onClick={() => handleDeleteImage(selectedImage)} className='absolute bottom-1 right-1 h-8 w-8 p-2 hover:bg-light-gray rounded-full cursor-pointer text-tomato' />
                    <img src={selectedImage.secureUrl} alt={selectedImage.publicId} className='object-contain w-full h-full' />
                </motion.div>
            </div>
        )}
        {isLoading ?
            <div className='flex justify-center items-center'>
                <div className='flex gap-2'>
                    <div className='w-3 h-3 rounded-full bg-bright-blue animate-bounce [animation-delay:.7s]'></div>
                    <div className='w-3 h-3 rounded-full bg-bright-blue animate-bounce [animation-delay:.3s]'></div>
                    <div className='w-3 h-3 rounded-full bg-bright-blue animate-bounce [animation-delay:.7s]'></div>
                </div>
            </div> 
            
            : (
                <div className='flex flex-wrap gap-4 overflow-y-auto justify-center sm:justify-start scrollbar-hide'>
                    {image.map((image) => (
                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} key={image._id} className='bg-soft-white shadow-sm rounded-lg w-56 h-60 flex flex-col justify-between'>
                            <div onClick={() => handleImageClick(image)} className='w-full h-40 bg-light-gray rounded-lg cursor-pointer'>
                                <img src={image.secureUrl} alt={image.publicId} className='w-full h-full object-cover rounded-t-lg' />
                            </div>
                            <div className='relative group'>
                                <div className='font-semibold font-base text-dark-gray overflow-hidden text-ellipsis whitespace-nowrap px-3 py-0'>{image.description}</div>
                                <div className='absolute invisible group-hover:visible text-xs font-normal bg-dark-gray text-soft-white px-2 py-1 rounded-lg top-full left-2 max-w-52 text-wrap'>{image.description}</div>
                            </div>
                            <div className='text-sm text-dark-gray/85 p-3 pt-0'>{new Date(image.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </motion.div>
                    ))}
                </div>
            )
        }
    </div>
  )
}
