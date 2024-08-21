'use client'
import React, { useState, useContext } from 'react'
import { LoaderCircle } from 'lucide-react'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { AlertContext } from '@/context/AlertContext'

const schema = z.object({
    email: z.string().min(1, { message: 'Field is required' }).email({ message: 'Invalid email' })
})

type FormData = {
    email: string
}

export const GetOtpForm = ({ enableForm }: { enableForm: () => void }) => {
    const [isDisabled, setIsDisabled] = useState(false)
    const [buttonText, setButtonText] = useState<React.ReactNode>('Get OTP')

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            email: '',
        },
        resolver: zodResolver(schema)
    })

    const alertContext = useContext(AlertContext)
    if (!alertContext) return null

    const startTimer = () => {
        let countdownTime = 120
        setButtonText(`${countdownTime}s`)
        setIsDisabled(true)

        const countdown = setInterval(() => {
            countdownTime -= 1
            setButtonText(`${countdownTime}s`)

            if (countdownTime <= 0) {
                clearInterval(countdown)
                setIsDisabled(false)
                setButtonText('Get OTP')
            }
        }, 1000)
    }

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setButtonText(<LoaderCircle className='w-5 h-5 animate-spin' />)
        try {
            const response = await axios.post('/api/get-otp', data)
            if (response.status === 200) {
                alertContext.success(response.data.message, 5)
                enableForm()
                startTimer()
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alertContext.error(error.response?.data.message, 5)
            } else {
                alertContext.error('Something went wrong', 5)
            }
            setButtonText('Get OTP')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='mb-3 w-full'>
            <label htmlFor="email" className='flex w-full'>
                <input type="email" id="email" {...register('email')} placeholder="Enter your email address" className='rounded-l-lg bg-transparent w-40 sm:flex-1' />
                <button className={`text-soft-white w-16 rounded-r-lg text-sm font-semibold flex justify-center items-center ${isDisabled ? 'bg-bright-blue/50 cursor-not-allowed' : 'bg-bright-blue cursor-pointer'}`} disabled={isDisabled}>
                    <div>{buttonText}</div>
                </button>
            </label>
            {errors.email && <p className='text-tomato text-sm'>{errors.email.message}</p>}
        </form>
    )
}
