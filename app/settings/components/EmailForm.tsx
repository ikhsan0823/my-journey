'use client'
import { X, CircleCheck, CircleX, LoaderCircle } from 'lucide-react'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { AlertContext } from '@/context/AlertContext'
import { useAuth } from '@/context/AuthContext'
import { GetOtpForm } from './GetOtpForm'

const schema = z.object({
    otp: z.string().min(1, { message: 'Field is required' }).refine(
        (v) => /^\d+$/.test(v),
        { message: 'OTP must be a number' }
    ),
    newEmail: z.string().min(1, { message: 'Field is required' }).email({ message: 'Invalid email' })
})

type FormData = {
    otp: string
    newEmail: string
}

export const EmailForm = ({closeForm} : {closeForm: () => void}) => {
  const [isDisabled, setIsDisabled] = useState(true)
  const [submitButtonText, setSubmitButtonText] = useState<React.ReactNode>('Change Email')

  const { fetchData } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      otp: '',
      newEmail: ''
    },
    resolver: zodResolver(schema)
  })

  const alertContext = useContext(AlertContext)
  if (!alertContext) return null

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setSubmitButtonText(<LoaderCircle className='w-5 h-5 animate-spin' />)
    try {
      const response = await axios.patch('/api/email', data)
      if (response.status === 200) {
        setSubmitButtonText(<CircleCheck className='w-5 h-5' />)
        alertContext.success(response.data.message, 5)
        fetchData()
        await delay(2000)
        setSubmitButtonText('Change Email')
        await delay(1000)
        closeForm()
      }
    } catch (error: unknown) {
         setSubmitButtonText(<CircleX className='w-5 h-5' />)
         if (axios.isAxiosError(error)) {
            alertContext.error(error.response?.data.message, 5)
         } else {
            alertContext.error('Something went wrong', 5)
         }
         await delay(2000)
         setSubmitButtonText('Change Email')
    }
  }
  return (
    <div className='w-full h-full absolute top-0 left-0 bg-dark-gray/50'>
        <div className='w-64 sm:w-[600px] h-fit bg-soft-white rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='h-full w-full p-5 relative'>
                <X size={20} onClick={closeForm} className='absolute top-2 right-2 cursor-pointer text-dark-gray/50 hover:text-dark-gray' />
                <div>
                    <div className='text-base font-semibold mb-5'>Change Email</div>
                    <GetOtpForm enableForm={() => setIsDisabled(false)} />
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full'>
                        <div className='flex flex-col w-full mb-3'>
                            <label htmlFor="otp" className='mb-1'>OTP</label>
                            <input type="text" id="otp" {...register('otp')} placeholder="Enter OTP"
                            autoComplete='off' className='rounded-lg bg-transparent' disabled={isDisabled} />
                            {errors.otp && <p className='text-tomato text-sm'>{errors.otp.message}</p>}
                        </div>
                        <div className='flex flex-col w-full mb-5'>
                            <label htmlFor="newEmail" className='mb-1'>New Email</label>
                            <input type="email" id="newEmail" {...register('newEmail')} autoComplete='off' placeholder="Enter your new email address" className='rounded-lg bg-transparent' disabled={isDisabled} />
                            {errors.newEmail && <p className='text-tomato text-sm'>{errors.newEmail.message}</p>}
                        </div>
                        <div className='w-full flex justify-end'>
                            <button className={`text-soft-white w-32 h-10 flex justify-center items-center rounded-lg text-sm font-semibold mt-3 ${isDisabled ? 'cursor-not-allowed bg-bright-blue/50' : 'cursor-pointer bg-bright-blue hover:bg-tomb-blue'}`} disabled={isDisabled}>
                                <div>{submitButtonText}</div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
