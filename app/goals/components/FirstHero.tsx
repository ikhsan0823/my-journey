'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Goal } from 'lucide-react'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'

const schema = z.object({
    priority: z.string().min(1, { message: 'Field is required' }),
    category: z.string().min(1, { message: 'Field is required' }),
    goals: z.string().min(1, { message: 'Field is required' }),
    reason: z.string().min(1, { message: 'Field is required' }),
    startTime: z.string().min(1, { message: 'Field is required' }),
    completionDate: z.string().min(1, { message: 'Field is required' }),
    steps: z.array(z.object({
        step: z.string().min(1, { message: 'Field is required' })
    }))
})

type InputProps = z.infer<typeof schema>
type FieldNameType = keyof InputProps | `steps.${number}.step`

const stepForms: { id: number, field: FieldNameType[] }[] = [
    {
        id: 1,
        field: ['priority', 'category'],
    },
    {
        id: 2,
        field: ['goals', 'reason'],
    },
    {
        id: 3,
        field: ['startTime', 'completionDate'],
    },
    {
        id: 4,
        field: ['steps'],
    }
]

export const FirstHero = ({ onSubmitted }: { onSubmitted: () => void}) => {
    const [prevForms, setPrevForm] = useState(0)
    const [currForm, setCurrForm] = useState(0)
    const [isLongtimeDisabled, setIsLongtimeDisabled] = useState(true);
    const delta = currForm - prevForms

    const { register, control, handleSubmit, reset, watch, trigger, formState: { errors } } = useForm<InputProps>({ 
        defaultValues: {
            priority: '',
            category: '',
            goals: '',
            reason: '',
            completionDate: '',
            startTime: '',
            steps: [{ step: '' }]
        },
        resolver: zodResolver(schema) 
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'steps'
    });

    const startimeValue = watch('startTime');

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startTime')?.setAttribute('min', today);

        if (startimeValue) {
            document.getElementById('completionDate')?.setAttribute('min', startimeValue);
            setIsLongtimeDisabled(false);
        } else {
            setIsLongtimeDisabled(true);
        }
    }, [startimeValue])

    const onSubmit: SubmitHandler<InputProps> = async (data) => {
        try {
            const response = await axios.post('/api/goals/create', data)
            console.log(response);
            onSubmitted()
        } catch (error) {
            console.log(error);
        }
        reset()
        setCurrForm(0)
    }

    const nextForm = async () => {
        const field = stepForms[currForm].field
        const output = await trigger(field)
        if (!output) return
        if (currForm < 3) {
            setCurrForm(currForm + 1)
            setPrevForm(currForm)
        }
    }

    const prevForm = () => {
        if (currForm > 0) {
            setPrevForm(currForm)
            setCurrForm(currForm - 1)
        }
    }

    return (
        <div className='px-5 sm:px-10 pt-5 pb-5 flex flex-col w-full h-full'>
            <div className='text-base font-semibold mb-5 flex justify-end sm:justify-start items-center'>
                <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='flex items-center gap-2 flex-row-reverse sm:flex-row'>
                    <Goal size={24} />
                    <div>Goals</div>
                </motion.div>
            </div>
            <div className='flex-1 flex flex-col'>
                <div className='w-full flex justify-center items-center gap-2 mt-5'>
                    <div className={`h-2 w-2 rounded-full ${currForm === 0 ? 'bg-bright-blue' : 'bg-bright-blue/50'}`}></div>
                    <div className={`h-2 w-2 rounded-full ${currForm === 1 ? 'bg-bright-blue' : 'bg-bright-blue/50'}`}></div>
                    <div className={`h-2 w-2 rounded-full ${currForm === 2 ? 'bg-bright-blue' : 'bg-bright-blue/50'}`}></div>
                    <div className={`h-2 w-2 rounded-full ${currForm === 3 ? 'bg-bright-blue' : 'bg-bright-blue/50'}`}></div>
                </div>
                <div className='text-dark-gray text-xl font-medium mb-5 text-center w-full py-5'>Set Your Goals</div>
                <div className='flex-1 py-5'>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-56 h-full flex flex-col justify-between mx-auto'>
                        <div className='flex-1'>
                            {currForm === 0 && <motion.div initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className='w-full h-full flex flex-col'>
                                <label htmlFor="priority" className='mb-2 text-base font-semibold text-dark-gray'>How is the priority scale of your goals?</label>
                                <select id="priority" {...register('priority')} className={`form-select rounded-lg ${errors.priority ? 'mb-1' : 'mb-3'} bg-transparent border border-dark-gray/50 focus:outline-none focus:border-dark-gray text-dark-gray`}>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                {errors.priority && <p className='text-xs text-tomato mb-3'>{errors.priority.message}</p>}
                                <label htmlFor="category" className='mb-2 text-base font-semibold text-dark-gray'>Which category does your goal fall into?</label>
                                <input type="text" {...register('category')} id='category' placeholder='Health, Career, Finance, Personal Development, etc.' className={`form-input rounded-lg ${errors.category ? 'mb-1' : 'mb-3'} bg-transparent border border-dark-gray/50 focus:outline-none focus:border-dark-gray text-dark-gray`} />
                                {errors.category && <p className='text-xs text-tomato mb-3'>{errors.category.message}</p>}
                            </motion.div>}
                            {currForm === 1 && <motion.div initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className='w-full h-full flex flex-col'>
                                <label htmlFor="goals" className='mb-2 text-base font-semibold text-dark-gray'>What do you want to achieve?</label>
                                <input type="text" {...register('goals')} id="goals" placeholder='e.g., Save $5,000 for a vacation' className={`form-input rounded-lg ${errors.goals ? 'mb-1' : 'mb-3'} bg-transparent border border-dark-gray/50 focus:outline-none focus:border-dark-gray text-dark-gray`} />
                                {errors.goals && <p className='text-xs text-tomato mb-3'>{errors.goals.message}</p>}
                                <label htmlFor="reason" className='mb-2 text-base font-semibold text-dark-gray'>How do you want to measure success?</label>
                                <textarea {...register('reason')} id="reason" placeholder='e.g., By achieving a target savings amount' className={`form-input rounded-lg ${errors.reason ? 'mb-1' : 'mb-3'} bg-transparent border border-dark-gray/50 focus:outline-none focus:border-dark-gray text-dark-gray scrollbar-hide`} rows={2}></textarea>
                                {errors.reason && <p className='text-xs text-tomato mb-3'>{errors.reason.message}</p>}
                            </motion.div>}
                            {currForm === 2 && <motion.div initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className='w-full h-full flex flex-col'>
                                <label htmlFor="startTime" className='mb-2 text-base font-semibold text-dark-gray'>When do you want to start?</label>
                                <input type="date" {...register('startTime')} id='startTime' className={`form-input rounded-lg ${errors.startTime ? 'mb-1' : 'mb-3'} bg-transparent border border-dark-gray/50 focus:outline-none focus:border-dark-gray text-dark-gray`} />
                                {errors.startTime && <p className='text-xs text-tomato mb-3'>{errors.startTime.message}</p>}
                                <label htmlFor="completionDate" className='mb-2 text-base font-semibold text-dark-gray'>What is your target completion date?</label>
                                <input type="date" {...register('completionDate')} id='completionDate' className={`form-input rounded-lg ${errors.completionDate ? 'mb-1' : 'mb-3'} bg-transparent border border-dark-gray/50 focus:outline-none focus:border-dark-gray text-dark-gray`} disabled={isLongtimeDisabled} />
                                {errors.completionDate && <p className='text-xs text-tomato mb-3'>{errors.completionDate.message}</p>}
                            </motion.div>}
                            {currForm === 3 && <motion.div initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className='w-full h-full flex flex-col overflow-hidden'>
                                <div className='mb-3 text-base font-semibold text-dark-gray'>What is your step to achieve your goals?</div>
                                <div className='w-full max-h-36 overflow-y-auto scrollbar-hide'>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="mb-2 w-full px-1 flex flex-col">
                                            <label htmlFor={`steps.${index}.step`} className='mb-1 text-sm font-semibold text-dark-gray'>Step {index + 1}</label>
                                            <input
                                                type="text"
                                                {...register(`steps.${index}.step` as const)}
                                                id={`steps.${index}.step`} placeholder={`${index === 0 ? 'e.g., Set a monthly budget and identify areas to cut expenses' : 'Your next step'}`}
                                                className={`form-input rounded-lg ${errors.steps?.[index]?.step ? 'mb-1' : ''} bg-transparent border border-dark-gray/50 focus:outline-none focus:border-dark-gray text-dark-gray`}
                                            />
                                            {errors.steps?.[index]?.step && (
                                                <p className='text-xs text-tomato'>{errors.steps[index].step?.message}</p>
                                            )}
                                            <button type="button" onClick={() => remove(index)} className={`text-tomato font-semibold text-sm self-end ${index === 0 || index === 1 || index === 2 ? 'hidden' : ''}`}>
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={() => append({ step: '' })} className="text-bright-blue hover:text-tomb-blue font-semibold mt-3">
                                    Add Step
                                </button>
                            </motion.div>}
                        </div>
                        <div className='w-full flex justify-end mt-10'>
                            <button type='button' onClick={() => prevForm()} className={`border border-dark-gray text-dark-gray font-semibold rounded-l-lg py-2 px-3`} disabled={currForm === 0} ><ChevronLeft size={20} /></button>
                            <button type='button' onClick={() => nextForm()} className={`border border-dark-gray text-dark-gray font-semibold rounded-r-lg py-2 px-3 ${currForm === 3 ? 'hidden' : ''}`}><ChevronRight size={20} /></button>
                            <button type='submit' className={`border border-dark-gray text-dark-gray font-semibold rounded-r-lg px-3 ${currForm === 3 ? '' : 'hidden'}`}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
