'use client'
import React, { useState } from 'react'
import { Card } from './Card'
import { X } from 'lucide-react'

type Note = {
    _id: string
    title: string
    content: string
    category: string
    date: Date
}

export const CardContainer = ({ notes }: { notes: Note[] }) => {
  const [showNote, setShowNote] = useState(false)
  const [noteDetails, setNoteDetails] = useState<Note | null>(null)

  const showNoteHandle = (note: Note) => {
    setShowNote(true)
    setNoteDetails(note)
  }

  const hideNoteHandle = () => {
    setShowNote(false)
    setNoteDetails(null)
  }

  return (
    <div className='flex-1 overflow-y-auto scrollbar-hide'>
      {showNote && noteDetails && (
        <div className='w-full h-full top-0 left-0 fixed z-50 bg-dark-gray/50'>
          <div className='w-[300px] sm:w-[600px] h-[90%] bg-soft-white rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='h-full w-full relative p-5 flex flex-col'>
              <X onClick={hideNoteHandle} className='absolute top-2 right-2 cursor-pointer text-dark-gray/50 hover:text-dark-gray' size={15} />
              <div className='flex-1 flex flex-col overflow-hidden'>
                <div className='text-sm mt-3'>{new Date(noteDetails.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className='font-semibold text-lg'>{noteDetails.title}</div>
                <div className='mt-6 flex-1 overflow-y-auto scrollbar-hide bg-light-gray p-3 rounded-lg text-sm whitespace-pre-wrap'>{noteDetails.content}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {notes.map((note) => (
            <Card 
              key={note._id}
              title={note.title} 
              content={note.content} 
              date={new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
              category={note.category}
              id={note._id} 
              onClick={() => showNoteHandle(note)}
            />
        ))}
      </div>
    </div>
  )
}
