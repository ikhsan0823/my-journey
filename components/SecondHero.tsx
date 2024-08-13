'use client'
import Link from 'next/link'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { motion } from 'framer-motion'

import { AtSign, Lock, LoaderCircle, CircleCheck, CircleX } from 'lucide-react'

import { AlertContext } from '@/context/AlertContext'

type InputProps = {
  username: string
  password: string
}

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }).min(8, { message: 'Invalid password' })
})
export const SecondHero = () => {
  const [buttonTitle, setButtonTitle] = React.useState<React.ReactNode>('Sign in')

  const alertContext = React.useContext(AlertContext);
  if (!alertContext) return null;
  const { success, error } = alertContext;

  const errorAlert = (message: string, timeout: number) => {
    error(message, timeout);
  }

  const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InputProps>({
    defaultValues: {
      username: '',
      password: ''
    },
    resolver: zodResolver(loginSchema)
  });

  const onSubmit: SubmitHandler<InputProps> = async (data) => {
    setButtonTitle(<LoaderCircle className='font-semibold w-5 h-5 animate-spin' />)
    try {
      const response = await axios.post('/api/login', data);

      if (response.status === 200) {
        setButtonTitle(<CircleCheck className='font-semibold w-5 h-5' />)
        success(response.data.message, 5);
        await delay(1000);
        reset();
        setButtonTitle('Sign in');
        console.log(response.data);
        await delay(2000);
        window.location.reload();
      }
    } catch (error: unknown) {
      setButtonTitle(<CircleX className='font-semibold w-5 h-5' />)
      if (axios.isAxiosError(error)) {
        errorAlert(error.response?.data.message, 5);
        await delay(1000);
        reset();
        setButtonTitle('Sign in');
      } else {
        errorAlert('Something went wrong', 5);
        console.log(error);
        await delay(1000);
        reset();
        setButtonTitle('Sign in');
      }
    }
  }
  return (
      <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='h-fit w-64 bg-soft-white p-5 rounded-lg shadow-md'>
          <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className='text-3xl font-bold text-bright-blue mb-8'>Sign in</h1>
              <div className='flex flex-col text-dark-gray relative'>
                  <AtSign className='absolute top-1/2 transform -translate-y-1/2 left-2' size={15} />
                  <input type="text" {...register('username')} id="username" placeholder='Username' className='w-full pl-7 pr-2 py-2 rounded-lg bg-transparent border-2 border-bright-blue/20 focus:outline-none focus:border-bright-blue' />
              </div>
              <div className='mb-3 text-tomato text-sm'>{errors?.username?.message}</div>
              <div className='flex flex-col text-dark-gray relative'>
                  <Lock className='absolute top-1/2 transform -translate-y-1/2 left-2' size={15} />
                  <input type="password" {...register('password')} id="password" placeholder='Password' className='w-full pl-7 pr-2 py-2 rounded-lg bg-transparent border-2 border-bright-blue/20 focus:outline-none focus:border-bright-blue' />
              </div>
              <div className='text-tomato text-sm'>{errors?.password?.message}</div>
              <div className='w-full flex justify-end items-center mt-1'><Link className='text-bright-blue text-sm' href="/forgot-password">Forgot password?</Link></div>
              <motion.button whileTap={{ scale: 0.8 }} className='w-full mt-5 py-2 px-3 bg-bright-blue hover:bg-tomb-blue rounded-lg font-semibold text-sm text-soft-white flex justify-center items-center'>
                <span>{buttonTitle}</span>
              </motion.button>
          </form>
          <hr className="my-6 border-dark-gray/20 w-full"></hr>
          <div className='text-sm text-dark-gray'>Need an account? <Link className='text-bright-blue' href="/register">Register</Link></div>
      </motion.div>
  )
}
