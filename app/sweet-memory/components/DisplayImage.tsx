'use client';

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { X } from 'lucide-react';

type Image = {
    _id: string;
    description: string;
    file: string;
    date: Date;
}

export const DisplayImage = () => {
    const [image, setImages] = useState<Image[]>([])
    const [showImage, setShowImage] = useState(false)
    const [selectedImage, setSelectedImage] = useState<Image | null>(null)

    const fetchImage = async () => {
        const response = await axios.get('/api/image')
        setImages(response.data.images)
    }

    useEffect(() => {
        fetchImage()
    }, [])

    const handleImageClick = (image: Image) => {
        setSelectedImage(image)
        setShowImage(true)
    }
  return (
    <div className='px-5 sm:px-10 pt-5 pb-5 flex flex-col w-full h-full overflow-hidden'>
        {showImage && selectedImage && (
            <div className='fixed top-0 left-0 w-full h-full bg-dark-gray/50 z-50 flex items-center justify-center'>
                <div className='bg-soft-white h-72 w-72 sm:h-96 sm:w-96 p-5 rounded-lg relative'>
                    <X className='absolute top-1 right-1 cursor-pointer text-dark-gray/50 hover:text-dark-gray' size={15} onClick={() => setShowImage(false)} />
                    <img src={selectedImage.file} alt={selectedImage.description} className='object-contain w-full h-full' />
                </div>
            </div>
        )}
        <div className='flex flex-wrap gap-4 overflow-y-auto justify-center scrollbar-hide'>
            {image.map((image) => (
                <div key={image._id} className='bg-soft-white shadow-sm p-3 rounded-lg w-56 h-72 flex flex-col justify-between'>
                    <div onClick={() => handleImageClick(image)} className='w-full h-40 bg-light-gray rounded-lg p-1 cursor-pointer'>
                        <img src={image.file} alt={image.description} className='w-full h-full object-contain' />
                    </div>
                    <div className='mt-2 text-sm font-semibold text-dark-gray'>{new Date(image.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    <div className='font-semibold font-base text-dark-gray break-words overflow-hidden leading-tight'>{image.description}</div>
                    <div className='text-sm text-dark-gray/85'>{new Date(image.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
            ))}
        </div>
    </div>
  )
}
