'use client'
import { X } from 'lucide-react'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'

const schema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    username: z.string().min(1, { message: 'Username is required' }),
    birthDate: z
        .string()
        .min(1, { message: 'Date of birth is required' })
        .refine(
            (date) => 
                date === '-' ||
                /^\d{4}\/\d{2}\/\d{2}$/.test(date),
            { message: 'Invalid date format (YYYY/MM/DD or -)' }
        )
        .refine(
            (date) => {
                if (date === '-') return true;
                const [year, month, day] = date.split('/').map(Number);
                const parsedDate = new Date(year, month - 1, day);
                return parsedDate.getFullYear() === year &&
                    parsedDate.getMonth() === month - 1 &&
                    parsedDate.getDate() === day;
            },
            { message: 'Invalid date' }
        ),
    gender: z.string().min(1, { message: 'Gender is required' }),
    phone: z
            .string()
            .min(1, { message: 'Phone is required' })
            .refine((phone) => /^\d+$/.test(phone), { message: 'Phone Number must be a number' }),
});


interface InputProps {
    name: string
    username: string
    birthDate: string
    gender: string
    phone: string
}

export const ProfileForm = ({formClose, profileData, updateProfile}: {formClose: () => void, profileData: {name: string, username: string, birthDate: string, gender: string, phone: string, _id: string}, updateProfile: () => void}): JSX.Element => {
  const { register, handleSubmit, formState: { errors } } = useForm<InputProps>({
    resolver: zodResolver(schema),
    defaultValues: {
        name: profileData.name,
        username: profileData.username,
        birthDate: profileData.birthDate,
        gender: profileData.gender,
        phone: profileData.phone
    }
  })

  const onSubmit: SubmitHandler<InputProps> = async (data) => {
    try {
        const response = await axios.patch(`/api/profile/details/${profileData._id}`, data)
        console.log(response)
        updateProfile()
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <div className='w-full h-full top-0 left-0 absolute z-50 bg-dark-gray/50'>
        <div className='w-[300px] sm:w-[600px] h-fit bg-soft-white rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='h-full w-full relative p-5 flex flex-col'>
                <X size={20} className='absolute top-2 right-2 cursor-pointer text-dark-gray/50 hover:text-dark-gray' onClick={formClose} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='text-lg font-semibold my-3'>Edit Profile</div>
                    <div className='flex flex-col gap-3'>
                        <div className='flex flex-col w-full'>
                            <label className='font-semibold mb-1' htmlFor="username">Username</label>
                            <input type="text" {...register('username')} id="username" className='rounded-lg bg-transparent' />
                            {errors.username && <p className='text-tomato'>{errors.username.message}</p>}
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-semibold mb-1' htmlFor="name">Name</label>
                            <input type="text" {...register('name')} id="name" className='rounded-lg bg-transparent' />
                            {errors.name && <p className='text-tomato'>{errors.name.message}</p>}
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-semibold mb-1' htmlFor="birthdate">Date of Birth</label>
                            <input type="text" {...register('birthDate')} id="birthdate" className='rounded-lg bg-transparent' />
                            {errors.birthDate && <p className='text-tomato'>{errors.birthDate.message}</p>}
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-semibold mb-1' htmlFor="gender">Gender</label>
                            <select id="birthdate" {...register('gender')} className='rounded-lg bg-transparent'>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="none">None</option>
                            </select>
                            {errors.gender && <p className='text-tomato'>{errors.gender.message}</p>}
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-semibold mb-1' htmlFor="phone">Phone Number</label>
                            <input type="text" {...register('phone')} id="phone" className='rounded-lg bg-transparent' />
                            {errors.phone && <p className='text-tomato'>{errors.phone.message}</p>}
                        </div>
                        <div className='flex justify-end'>
                            <button className='w-28 h-8 rounded-lg bg-bright-blue text-soft-white flex justify-center items-center text-sm font-semibold hover:bg-tomb-blue'>
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
