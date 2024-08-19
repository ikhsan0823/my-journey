import { User } from 'lucide-react'
import { v2 as cloudinary } from 'cloudinary';
import React from 'react'
import { SideProfile } from './SideProfile'
import { DetailsProfile } from './DetailsProfile'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Profile = () => {
    const create = async (formData: FormData, username: string) => {
        'use server';
        const file = formData.get('file') as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const tags = `${username}Profile`

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                tags: [tags],
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
    <div className='px-5 sm:px-10 pt-5 pb-5 flex flex-col w-full h-full'>
        <div className='text-base font-semibold mb-5 flex justify-end sm:justify-start items-center'>
            <div className='flex items-center gap-2 flex-row-reverse sm:flex-row'>
                <User size={24} />
                <div>Profile</div>
            </div>
        </div>
        <div className='flex-1'>
            <div className='w-full h-full flex flex-col md:flex-row gap-5'>
                <SideProfile onSubmit={create} />
                <DetailsProfile />
            </div>
        </div>
    </div>
  )
}

export default Profile