import React, { useState } from 'react'
import { CircleCheck, CircleX, LoaderCircle, X } from 'lucide-react'
import axios from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertContext } from '@/context/AlertContext'

const schema = z.object({
    title: z.string().min(1, { message: 'This field is required' }),
    content: z.string().min(1, { message: 'This field is required' }),
    category: z.string().min(1, { message: 'This field is required' })
        .refine(v => /^[a-zA-Z]+$/.test(v), { message: 'Category should only contain letters' })
        .refine(v => !/\s/.test(v), { message: 'Category should not contain spaces' }),
    date: z.string().min(1, { message: 'This field is required' })
})

type InputProps = {
    title: string
    content: string
    category: string
    date: string
}

export const EditNoteForm = ({closeForm, id, title, content, category}: {closeForm: () => void, id: string, title: string, content: string, category: string}) => {
    const [buttonTitle, setButtonTitle] = useState<React.ReactNode>('Update Note');
    const alertContext = React.useContext(AlertContext);
    if (!alertContext) return null;
    const { success, error } = alertContext;

    const errorAlert = (message: string, timeout: number) => {
        error(message, timeout);
    }

    const delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
  const { register, handleSubmit, formState: { errors } } = useForm<InputProps>({
      defaultValues: {
        title: title,
        content: content,
        category: category,
        date: new Date().toISOString(),
      },

      resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<InputProps> = async (data) => {
    setButtonTitle(<LoaderCircle className='animate-spin size-5' />)
    try {
        const response = await axios.patch(`/api/note/update/${id}`, data)
        setButtonTitle(<CircleCheck className='size-5' />)
        success(response.data.message, 5)
        await delay(2000)
        setButtonTitle('Update Note')
        const triggerFetchNotes = () => {
            const event = new CustomEvent('fetchNotes');
            window.dispatchEvent(event);
        }
        triggerFetchNotes()
        await delay(2000)
        closeForm()
    } catch (error) {
        setButtonTitle(<CircleX className='size-5' />)
        if (axios.isAxiosError(error)) {
            errorAlert(error.response?.data.message, 5)
        } else {
            errorAlert('Something went wrong', 5)
        }
        await delay(2000)
        setButtonTitle('Update Note')
        console.log(error)
    }
  }
  return (
    <div className='w-full h-full top-0 left-0 absolute z-50 bg-dark-gray/50'>
        <div className='w-[300px] sm:w-[600px] h-[90%] bg-soft-white rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='h-full w-full relative p-5 flex flex-col'>
                <X onClick={() => closeForm()} className='absolute top-2 right-2 cursor-pointer text-dark-gray/50 hover:text-dark-gray' size={15} />
                <form onSubmit={handleSubmit(onSubmit)} className='mt-5 flex-1 flex flex-col justify-between'>
                    <div className='flex flex-col mb-3'>
                        <label htmlFor="title" className='mb-1'>Title</label>
                        <input type="text" id="title" className='rounded-lg bg-transparent' {...register("title")} />
                        {errors.title && <p className='text-tomato'>{errors.title.message}</p>}
                    </div>
                    <div className='flex flex-col mb-3'>
                        <label htmlFor="content" className='mb-1'>Content</label>
                        <textarea id="content" rows={8} className='rounded-lg bg-transparent' {...register("content")} />
                        {errors.content && <p className='text-tomato'>{errors.content.message}</p>}
                    </div>
                    <div className='flex flex-col mb-3'>
                        <label htmlFor="category" className='mb-1'>Category</label>
                        <input type="text" id="category" className='rounded-lg bg-transparent' {...register("category")} />
                        {errors.category && <p className='text-tomato'>{errors.category.message}</p>}
                    </div>
                    <input type="hidden" value={new Date().toISOString()} {...register("date")} />
                    <div className='flex justify-end'>
                        <button className='w-28 h-8 rounded-lg bg-bright-blue text-soft-white flex justify-center items-center text-sm font-semibold'>
                            <div>{buttonTitle}</div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
