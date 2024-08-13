'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { AtSign, Lock, Mail, LoaderCircle, CircleCheck, CircleX } from 'lucide-react'

import { AlertContext } from '@/context/AlertContext'

type InputProps = {
  email: string
  username: string
  password: string
  repeatPassword: string
}

const registerSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email' }),
  username: z.string().min(1, { message: 'Username is required' }).min(5, { message: 'Username must be at least 5 characters' }).refine(v => !/\s/.test(v), { message: 'Username should not contain spaces' }),
  password: z.string().min(1, { message: 'Password is required' }).min(8, { message: 'Invalid password' }).refine(v => /[A-Z]/.test(v), { message: 'Password must contain at least one uppercase' }).refine(v => /[a-z]/.test(v), { message: 'Password must contain at least one lowercase' }).refine(v => /\d/.test(v), { message: 'Password must contain at least one number' }),
  repeatPassword: z.string().min(1, { message: 'Repeat password is required'})
}).refine(data => data.password === data.repeatPassword, {
  message: 'Passwords do not match',
  path: ['repeatPassword']
})

export const Hero = () => {
  const [buttonTitle, setButtonTitle] = React.useState<React.ReactNode>('Register')

  const alertContext = React.useContext(AlertContext);
  if (!alertContext) return null;
  const { success, error } = alertContext;

  const errorAlert = (message: string, timeout: number) => {
    error(message, timeout);
  }

  const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InputProps>({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      repeatPassword: ''
    },
    resolver: zodResolver(registerSchema)
  });

  const onSubmit: SubmitHandler<InputProps> = async (data) => {
    setButtonTitle(<LoaderCircle className='font-semibold w-5 h-5 animate-spin' />)
    try {
      const response = await axios.post('/api/register', data);
      if (response.status === 201) {
        setButtonTitle(<CircleCheck className='font-semibold w-5 h-5' />)
        success(response.data.message, 5);
        await delay(1000);
        reset();
        setButtonTitle('Register');
        await delay(2000);
        router.push('/');
      }
    } catch (error: unknown) {
      setButtonTitle(<CircleX className='font-semibold w-5 h-5' />)
      if (axios.isAxiosError(error)) {
        errorAlert(error.response?.data.message, 5);
        console.log(error.response?.data.message);
        await delay(1000);
        reset();
        setButtonTitle('Register');
      } else {
        errorAlert('Something went wrong', 5);
        console.log(error);
        await delay(1000);
        reset();
        setButtonTitle('Register');
      }
    }
  }
  return (
    <div>
        <Image src={'/background.png'} quality={100} fill alt='background' className='object-cover static -z-10' />
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
          <div className='h-fit w-64 sm:w-72 bg-soft-white p-5 rounded-lg shadow-md'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className='text-3xl font-bold text-bright-blue mb-8'>Register</h1>
              <div className='flex flex-col text-dark-gray relative'>
                  <Mail className='absolute top-1/2 transform -translate-y-1/2 left-2' size={15} />
                  <input type="text" {...register('email')} id="email" placeholder='Email' className='w-full pl-7 pr-2 py-2 rounded-lg bg-transparent border-2 border-bright-blue/20 focus:outline-none focus:border-bright-blue' />
              </div>
              <div className='mb-3 text-tomato text-sm text-left'>{errors?.email?.message}</div>
              <div className='flex flex-col text-dark-gray relative'>
                  <AtSign className='absolute top-1/2 transform -translate-y-1/2 left-2' size={15} />
                  <input type="text" {...register('username')} id="username" placeholder='Username' className='w-full pl-7 pr-2 py-2 rounded-lg bg-transparent border-2 border-bright-blue/20 focus:outline-none focus:border-bright-blue' />
              </div>
              <div className='mb-3 text-tomato text-sm text-left'>{errors?.username?.message}</div>
              <div className='flex flex-col text-dark-gray relative'>
                  <Lock className='absolute top-1/2 transform -translate-y-1/2 left-2' size={15} />
                  <input type="password" {...register('password')} id="password" placeholder='Password' className='w-full pl-7 pr-2 py-2 rounded-lg bg-transparent border-2 border-bright-blue/20 focus:outline-none focus:border-bright-blue' />
              </div>
              <div className='mb-3 text-tomato text-sm text-left'>{errors?.password?.message}</div>
              <div className='flex flex-col text-dark-gray relative'>
                  <Lock className='absolute top-1/2 transform -translate-y-1/2 left-2' size={15} />
                  <input type="password" {...register('repeatPassword')} id="repeatPassword" placeholder='Repeat password' className='w-full pl-7 pr-2 py-2 rounded-lg bg-transparent border-2 border-bright-blue/20 focus:outline-none focus:border-bright-blue' />
              </div>
              <div className='text-tomato text-sm text-left'>{errors?.repeatPassword?.message}</div>
              <button className='w-full mt-5 py-2 px-3 bg-bright-blue hover:bg-tomb-blue rounded-lg font-semibold text-sm text-soft-white flex justify-center items-center'>
                <span>{buttonTitle}</span>
              </button>
            </form>
            <hr className="my-6 border-dark-gray/20 w-full"></hr>
            <div className='text-sm text-dark-gray'>Already have an account? <Link className='text-bright-blue' href="/">Sign in</Link></div>
          </div>
        </motion.div>
    </div>
  )
}
