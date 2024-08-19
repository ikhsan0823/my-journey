/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Pencil } from 'lucide-react'
import React, { useState, useContext, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { AlertContext } from '@/context/AlertContext'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/context/AuthContext';
import axios from 'axios'
import { motion } from 'framer-motion'

const AcceptedImageTypes = ['image/jpeg', 'image/png', 'image/jpg']
const maxFileSize = 5 * 1024 * 1024

const schema = z.object({
  image: z
    .any()
    .refine((files) => AcceptedImageTypes.includes(files[0].type), {
      message: 'Only jpeg, jpg and png files are allowed',
    })
    .refine((files) => files[0].size <= maxFileSize, {
      message: 'Max file size is 5MB',
    })
})

type ImageForm = {
    image: FileList
}

export const SideProfile = ({ onSubmit }: { onSubmit: (formData: FormData, username: string) => Promise<any> }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [isUpdated, setIsUpdated] = useState(false)

    const alertContext = useContext(AlertContext);
    if (!alertContext) return null;
    const { success, error } = alertContext;
    const errorAlert = (message: string, timeout: number) => {
        error(message, timeout);
    }

    const { username, email } = useAuth();
    const randomId = () => {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const publicId = `${username}-${randomId()}`;

    const { register, handleSubmit, formState: { errors } } = useForm<ImageForm>({
      defaultValues: {
        image: undefined,
      },
      resolver: zodResolver(schema),
    })

    const onChange: SubmitHandler<ImageForm> = async (data) => {
      if (!data.image || data.image.length === 0) return

      const formData = new FormData();
      formData.append('publicId', publicId);
      formData.append('file', data.image[0]);

      try {
        const result = await onSubmit(formData, username!);
        const serverData = {
          publicId: formData.get('publicId') as string,
          secureUrl: result.secure_url,
        };
        const response = await axios.post('/api/profile/picture', serverData);
        fetchProfilePicture();
        success(response.data.message, 5)
        setIsUpdated(true)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          errorAlert(error.response?.data.message, 5)
        } else {
          errorAlert('Something went wrong', 5)
        }
      }
    }

    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get('/api/profile/picture');
        setSelectedImage(response.data.profilePicture.secureUrl);
        const updatedAt = new Date(response.data.profilePicture.updatedAt);
        const threeDaysLater = new Date(updatedAt.getTime() + 3 * 24 * 60 * 60 * 1000);
        if (updatedAt < threeDaysLater) {
          setIsUpdated(true)
        } else if (updatedAt > threeDaysLater) {
          setIsUpdated(false)
        }
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      fetchProfilePicture();
      if (errors.image && errors.image.message) {
        errorAlert(errors.image.message, 5);
      }
    }, [errors.image]);

    return (
        <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='p-5 bg-soft-white shadow-md w-full md:w-48 h-48 rounded-lg flex flex-col justify-center items-center'>
            <div className='rounded-full'>
                <div className='w-24 h-24 flex items-center justify-center relative group'>
                    <form onChange={handleSubmit(onChange)}>
                        {isUpdated && <div onClick={() => errorAlert('Profile picture was recently updated. Please wait for 3 days', 5)} className='absolute top-0 left-0 w-full h-full rounded-full z-50 cursor-pointer'></div>}
                        <label htmlFor="edit-photo-profile" className='absolute top-0 left-0 h-full w-full rounded-full z-40 cursor-pointer'>
                            <input type="file" {...register('image')} id="edit-photo-profile" className='hidden h-full w-full' />
                        </label>
                        <div className='absolute top-0 left-0 w-full h-full bg-dark-gray/50 rounded-full invisible group-hover:visible z-30'>
                            <Pencil size={15} className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-soft-white' />
                        </div>
                        <img src={selectedImage || "https://woodfibreinsulation.co.uk/wp-content/uploads/2017/04/blank-profile-picture-973460-1-1-1080x1080.png"} alt="photo-profile" className='object-cover rounded-full w-full h-full absolute top-0 left-0' />
                    </form>
                </div>
            </div>
            <div>
                <div className='text-sm mt-1 break-all text-center align-middle'>{email}</div>
            </div>
        </motion.div>
    )
}
