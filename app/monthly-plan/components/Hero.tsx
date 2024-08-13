'use client'
import { CalendarHeart, CircleX, ClipboardList, FolderX, LoaderCircle, Plus, X } from 'lucide-react'
import React, { useRef, useState, useEffect, createRef } from 'react'
import axios from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'

import { Calendar } from './Calendar'
import { AlertContext } from '@/context/AlertContext'

interface PlanItem {
  _id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  checked: boolean;
}

type InputProps = {
  title: string;
  description: string;
  time: string;
  date: string;
}

const planSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  time: z.string().min(1, { message: 'Time is required' }),
  date: z.string().min(1, { message: 'Date is required' })
})

export const Hero = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const upRef = useRef<HTMLDivElement>(null);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [defaultDate, setDefaultDate] = useState('');
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [detailsPlan, setDetailsPlan] = useState({
    _id: '',
    title: '',
    description: '',
    time: '',
    date: '',
    checked: false
  });
  const [showPlan, setShowPlan] = useState(false);
  const [buttonTitle, setButtonTitle] = useState<React.ReactNode>('Add');
  const childRef = createRef<{ updateCalendar: () => void } | null>();

  const alertContext = React.useContext(AlertContext);
  if (!alertContext) return null;
  const { success, error } = alertContext;

  const errorAlert = (message: string, timeout: number) => {
    error(message, timeout);
  }

  const scrollToTarget = (date: string) => {
        targetRef.current?.scrollIntoView({ behavior: 'smooth' });
        getPlans(date);
        getDayAndDate(date);
  }

  const scrollToUp = () => {
    upRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const getDayAndDate = (dateString: string) => {
    setDefaultDate(dateString)
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const formatedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setSelectedDate(formatedDate);
    setSelectedDay(dayOfWeek);
  };

  const getPlans = async (dates: string) => {
    setPlans([]);
    const date = dates;
    const response = await axios.get(`/api/plan/${date}`);
    const plans = response.data.plans.map((plan: PlanItem) => ({
      _id: plan._id,
      title: plan.title,
      description: plan.description,
      time: plan.time,
      date: plan.date,
      checked: plan.checked
    }))
    setPlans(plans);
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InputProps>({
    defaultValues: {
      title: '',
      description: '',
      time: '',
      date: '',
    },
    resolver: zodResolver(planSchema)
  });

  useEffect(() => {
    reset({ date: defaultDate });
  }, [defaultDate, reset]);

  const onSubmit: SubmitHandler<InputProps> = async (data) => {
    setButtonTitle(<LoaderCircle className='font-semibold w-5 h-5 animate-spin' />);
    try {
      const response = await axios.post('/api/plan/create', data);
      if (response.data.date) {
        success(response.data.message, 5);
        const [day, month, year] = response.data.date.split("/");
        const dateStr = `${year}-${month}-${day}`;
        reset();  
        getPlans(dateStr);
        setShowAddPlan(false);
      }
      if (childRef.current) {
        childRef.current.updateCalendar();
      }
      setButtonTitle('Add');
    } catch (error: unknown) {
      setButtonTitle(<CircleX className='font-semibold w-5 h-5' />);
      if (axios.isAxiosError(error)) {
        errorAlert(error.response?.data.message, 5);
        reset();
        setButtonTitle('Add');
      } else {
        errorAlert('Something went wrong', 5);
        reset();
        setButtonTitle('Add');
      }
    }
  }

  const showDetails = (plan: PlanItem) => {
    setShowPlan(true)
    setDetailsPlan(plan)
  }

  const handleComplete = async (id: string) => {
    try {
      const response = await axios.patch(`/api/plan/details/${id}`);
      if (response.data.date) {
        success(response.data.message, 5);
        const [day, month, year] = response.data.date.split("/");
        const dateStr = `${year}-${month}-${day}`;
        getPlans(dateStr);
      }
      const button = document.getElementById(id);
      if (button) {
        button.classList.toggle('hidden');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        errorAlert(error.response?.data.message, 5);
      } else {
        errorAlert('Something went wrong', 5);
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/plan/details/${id}`);
      if (response.data.date) {
        success(response.data.message, 5);
        const [day, month, year] = response.data.date.split("/");
        const dateStr = `${year}-${month}-${day}`;
        getPlans(dateStr);
      }
      if (childRef.current) {
        childRef.current.updateCalendar();
      }
      setShowPlan(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        errorAlert(error.response?.data.message, 5);
      } else {
        errorAlert('Something went wrong', 5);
      }
    }
  }

  return (
    <div className='h-full w-full overflow-y-auto scrollbar-hide flex flex-col'>
      <div ref={upRef} className='w-full min-h-screen max-h-screen p-3'>
        <div className="px-5 sm:px-10 pt-5 pb-5 flex flex-col w-full h-full">
          <div className="text-base font-semibold mb-5 flex justify-end sm:justify-start items-center">
            <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="flex items-center gap-2 flex-row-reverse sm:flex-row">
              <CalendarHeart size={24} />
              <div>Monthly Plan</div>
            </motion.div>
          </div>
          <div className='flex-1 overflow-y-hidden'>
            <Calendar onButtonClick={scrollToTarget} ref={childRef} />
          </div>
        </div>
      </div>
      <div className='w-full min-h-screen max-h-screen p-3'>
        <div className="px-5 sm:px-10 pt-5 pb-5 flex flex-col w-full h-full">
          <AnimatePresence>
            {showAddPlan && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-fit w-64 bg-soft-white shadow-md rounded-lg z-[100]'>
                <div className='w-full h-full relative p-5'>
                  <X className='absolute top-2 right-2 cursor-pointer text-dark-gray/50 hover:text-dark-gray' size={15} onClick={() => setShowAddPlan(false)} />
                  <div className='text-lg font-semibold mb-3'>Add Plan</div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" {...register('title')} placeholder='Title' className={`border-2 border-bright-blue/50 w-full p-2 rounded-lg focus:outline-none focus:border-bright-blue bg-transparent ${errors.title ? '' : 'mb-3'}`} />
                    {errors.title && <p className='text-xs text-tomato mb-3'>{errors.title.message}</p>}
                    <textarea {...register('description')} placeholder='Description' className={`border-2 border-bright-blue/50 w-full p-2 rounded-lg focus:outline-none focus:border-bright-blue bg-transparent ${errors.description ? '' : 'mb-3'}`} />
                    {errors.description && <p className='text-xs text-tomato mb-3'>{errors.description.message}</p>}
                    <input type="time" {...register('time')} placeholder='Time' className={`border-2 border-bright-blue/50 w-full p-2 rounded-lg focus:outline-none focus:border-bright-blue bg-transparent ${errors.time ? '' : 'mb-3'}`} />
                    {errors.time && <p className='text-xs text-tomato mb-3'>{errors.time.message}</p>}
                    <input type="date" {...register('date')} placeholder='Date' className={`border-2 border-bright-blue/50 w-full p-2 rounded-lg focus:outline-none focus:border-bright-blue bg-transparent ${errors.date ? '' : 'mb-3'}`} defaultValue={defaultDate} />
                    {errors.date && <p className='text-xs text-tomato mb-3'>{errors.date.message}</p>}
                    <button type="submit" className='bg-bright-blue px-3 py-2 rounded-lg w-20 text-sm font-semibold text-soft-white hover:bg-tomb-blue flex justify-center items-center'>
                      <span>{buttonTitle}</span>
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showPlan && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-fit w-64 bg-soft-white shadow-md rounded-lg z-[100]'>
                <div className='w-full h-full relative p-5'>
                  <X className='absolute top-2 right-2 cursor-pointer text-dark-gray/50 hover:text-dark-gray' size={15} onClick={() => setShowPlan(false)} />
                  <div className='text-xs text-dark-gray'>Monthly Plan</div>
                  <div className='text-lg font-semibold mb-3 text-dark-gray'>{detailsPlan.title}</div>
                  <div className='text-sm mb-3 text-dark-gray'>{detailsPlan.description}</div>
                  <div className='text-sm mb-3 text-dark-gray'>{detailsPlan.time} &bull; {new Date(detailsPlan.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div className='flex justify-end gap-3 mt-3'>
                    <button onClick={() => handleDelete(detailsPlan._id)} className='text-tomato hover:text-light-red text-base'>Delete</button>
                    <button  onClick={() => handleComplete(detailsPlan._id)} id={detailsPlan._id} className={`text-bright-blue hover:text-tomb-blue text-base ${detailsPlan.checked ? 'hidden' : ''}`}>Complete</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-base font-semibold mb-5 flex justify-end sm:justify-start items-center">
            <div ref={targetRef} className="flex items-center gap-2 flex-row-reverse sm:flex-row">
              <ClipboardList size={24} />
              <div>Plan Details</div>
            </div>
          </motion.div>
          <div className='flex-1 flex flex-col'>
            <div className='mb-5 relative'>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className='text-lg font-semibold'>{selectedDate}</motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.5 }} className='text-base'>{selectedDay}</motion.div>
              <motion.button initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }} onClick={() => setShowAddPlan(!showAddPlan)} className='absolute top-1/2 -translate-y-1/2 right-0 h-8 rounded-lg border border-bright-blue flex justify-center items-center group font-semibold'>
                <div className='text-sm px-2 h-full rounded-l-lg group-hover:bg-rainy-day flex justify-center items-center text-dark-gray'>Add Plan</div>
                <div className='h-full bg-bright-blue px-2 text-soft-white rounded-r-lg group-hover:bg-tomb-blue flex justify-center items-center'><Plus size={15} /></div>
              </motion.button>
            </div>
            <div className='flex-1'>
              {plans.length === 0 && selectedDate === '' && <div className='text-sm text-dark-gray/50 w-full h-full flex flex-col justify-center items-center'>
                <FolderX size={30} />
                <div>Please <span onClick={scrollToUp} className='text-bright-blue hover:text-tomb-blue underline cursor-pointer'>select a date</span> to see plans</div>
              </div>}
              {plans.length === 0 && selectedDate !== '' && <div className='text-sm text-dark-gray/50 w-full h-full flex flex-col justify-center items-center'>
                <FolderX size={30} />
                <div>No plans found</div>
              </div>}
              <div className='flex gap-3 flex-wrap'>
                {plans.map((plan, index) => (
                  <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }} key={index} onClick={() => showDetails(plan)} className='flex h-16 w-full md:max-w-[calc(50%-12px)] md:min-w-[calc(50%-12px)] gap-3 text-sm cursor-pointer group'>
                    <div className='w-12 justify-center items-center flex'>{plan.time}</div>
                    <div className='max-w-[calc(100%-3rem)] min-w-[calc(100%-3rem)] bg-bright-blue group-hover:bg-tomb-blue flex-col px-3 py-2 rounded-lg'>
                      <div className={`text-base font-bold text-soft-white overflow-hidden whitespace-nowrap text-ellipsis ${plan.checked ? 'line-through' : ''}`}>{plan.title}</div>
                      <div className={`text-xs text-dark-gray overflow-hidden whitespace-nowrap text-ellipsis ${plan.checked ? 'line-through' : ''}`}>{plan.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
