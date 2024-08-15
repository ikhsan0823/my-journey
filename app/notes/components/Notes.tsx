'use client'
import React, { useState, useEffect } from 'react'
import { Notebook } from 'lucide-react'
import axios from 'axios'
import { CardContainer } from './CardContainer'
import { AddNoteForm } from './AddNoteForm'

type Note = {
    _id: string
    title: string
    content: string
    category: string
    date: Date
}

const Notes = () => {
    const [category, setCategory] = useState('all')
    const [showAddNote, setShowAddNote] = useState(false)
    const [notes, setNotes] = useState<Note[]>([])
    const [allNotes, setAllNotes] = useState<Note[]>([])

    const fetchNotes = async () => {
        try {
            const response = await axios.get(category === 'all' ? '/api/note' : `/api/note/${category}`)
            setNotes(response.data.notes)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAllNotes = async () => {
        try {
            const response = await axios.get('/api/note')
            setAllNotes(response.data.notes)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchNotes()
        fetchAllNotes()
    }, [category])

    useEffect(() => {
        const handleFetchNotes = () => {
            fetchNotes();
            fetchAllNotes();
        };

        window.addEventListener('fetchNotes', handleFetchNotes);

        return () => {
            window.removeEventListener('fetchNotes', handleFetchNotes);
        };
    }, []);

    const getCategory = (category: string) => {
        setCategory(category)
    }

    const uniqueCategories = Array.from(new Set(allNotes.map(note => note.category.toLowerCase())));

    const categories = uniqueCategories.map(cat => {
        return allNotes.find(note => note.category.toLowerCase() === cat)?.category || cat;
    });

    return (
        <div className='px-5 sm:px-10 pt-5 pb-5 h-full w-full flex flex-col'>
            {showAddNote && <AddNoteForm closeForm={() => setShowAddNote(false)} />}
            <div className='text-base font-semibold mb-5 flex justify-end sm:justify-start items-center'>
                <div className='flex items-center gap-2 flex-row-reverse sm:flex-row'>
                    <Notebook size={24} />
                    <div>Notes</div>
                </div>
            </div>
            <div className='flex flex-col-reverse sm:flex-row sm:justify-between gap-2 sm:gap-5 mb-5'>
                <div className='flex gap-2'>
                    <button onClick={() => getCategory('all')} className={`px-2 py-1 rounded-lg text-sm font-semibold ${category === 'all' ? 'bg-bright-blue' : 'bg-bright-blue/50'} text-soft-white`}>All</button>
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => getCategory(cat)} className={`px-2 py-1 rounded-lg text-sm font-semibold capitalize ${category === cat ? 'bg-bright-blue' : 'bg-bright-blue/50'} text-soft-white`}>
                            {cat}
                        </button>
                    ))}
                </div>
                <div className='flex justify-end items-center'>
                    <button onClick={() => setShowAddNote(true)} className='px-2 py-1 rounded-lg text-sm font-semibold border-2 border-bright-blue text-bright-blue hover:bg-bright-blue hover:text-soft-white'>Add Note</button>
                </div>
            </div>
            <CardContainer notes={notes} />
        </div>
    )
}

export default Notes
