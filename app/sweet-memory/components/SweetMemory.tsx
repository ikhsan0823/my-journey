import React from 'react'
import { v2 as cloudinary } from 'cloudinary';
import { Carousels } from './Carousels';
import { DisplayImage } from './DisplayImage';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const SweetMemory = async () => {
  const create = async (formData: FormData, username: string) => {
    'use server';
    const file = formData.get('file') as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        tags: [username],
        public_id: formData.get('publicId') as string,
        folder: 'my journey',
      }, function (error, result) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      })
      .end(buffer);
    });
  }

  return (
    <div className='h-full w-full overflow-y-auto scrollbar-hide flex flex-col'>
      <div className='w-full min-h-screen max-h-screen p-3'>
        <Carousels onSubmit={create} />
      </div>
      <div className='w-full min-h-screen max-h-screen p-3'>
        <DisplayImage />
      </div>
    </div>
  )
}
