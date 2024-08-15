'use client'
import { CircleCheck, CircleX, EllipsisVertical, LoaderCircle } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import { AlertContext } from '@/context/AlertContext';
import { EditNoteForm } from './EditNoteForm';

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const Card = ({title, content, date, id, onClick, category}: {title: string, content: string, date: string, id: string, category: string, onClick: () => void}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [buttonTitle, setButtonTitle] = useState<React.ReactNode>('Yes');
  const alertContext = React.useContext(AlertContext);
  if (!alertContext) return null;
  const { success, error } = alertContext;

  const errorAlert = (message: string, timeout: number) => {
    error(message, timeout);
  }

  const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const noteDeleteHandle = async () => {
    setButtonTitle(<LoaderCircle className='animate-spin size-5' />)
    try {
      const response = await axios.delete(`/api/note/update/${id}`)
      setButtonTitle(<CircleCheck className='size-5' />)
      success(response.data.message, 5)
      await delay(2000)
      setButtonTitle('Yes')
      const triggerFetchNotes = () => {
          const event = new CustomEvent('fetchNotes');
          window.dispatchEvent(event);
      };
      triggerFetchNotes()
      await delay(2000)
      setShowDelete(false)
    } catch (error) {
      setButtonTitle(<CircleX className='size-5' />)
      if (axios.isAxiosError(error)) {
        errorAlert(error.response?.data.message, 5)
      } else {
        errorAlert('Something went wrong', 5)
      }
      await delay(2000)
      setButtonTitle('Yes')
      console.log(error)
    }
  }
  
  const truncatedContent = truncateText(content, 100);
  return (
    <div className='bg-bright-blue rounded-lg p-3 max-w-80 min-w-52 h-44 flex flex-col justify-between overflow-hidden'>
      {showEdit && <EditNoteForm closeForm={() => setShowEdit(false)} id={id} title={title} content={content} category={category} />}
      {showDelete && 
        <div className='w-full h-full top-0 left-0 absolute z-50 bg-dark-gray/50'>
          <div className='absolute top-5 left-1/2 -translate-x-1/2 w-64 h-40 bg-soft-white rounded-lg shadow-md'>
            <div className='h-full w-full p-3 flex flex-col justify-between'>
              <div>Are you sure you want to delete this note?</div>
              <div className='flex flex-col gap-1'>
                <button onClick={() => noteDeleteHandle()} className='bg-tomato hover:bg-light-red h-8 rounded-lg text-soft-white font-semibold text-sm flex items-center justify-center'>
                  <div>{buttonTitle}</div>
                </button>
                <button onClick={() => setShowDelete(false)} className='border-2 border-dark-gray/50 hover:bg-light-gray h-8 rounded-lg font-semibold text-sm'>No</button>
              </div>
            </div>
          </div>
        </div>
      }
        <div onClick={onClick} className='cursor-pointer'>
          <div className='font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap'>{title}</div>
          <div className='text-sm mb-5 overflow-hidden h-16 w-full'>{truncatedContent}</div>
        </div>
        <div className='text-sm flex items-center justify-between'>
          <div>{date}</div>
          <div className='p-2 text-dark-gray cursor-pointer relative group'>
            <EllipsisVertical size={20} />
            <div className='absolute bottom-1/2 right-full invisible group-hover:visible rounded-lg bg-dark-gray w-20 text-soft-white'>
              <button onClick={() => setShowEdit(true)} className='hover:bg-soft-white/25 w-full rounded-t-lg px-2 py-1 text-sm'>Edit</button>
              <button onClick={() => setShowDelete(true)} className='hover:bg-soft-white/25 w-full rounded-b-lg px-2 py-1 text-sm'>Delete</button>
            </div>
          </div>
        </div>
    </div>
  )
}
