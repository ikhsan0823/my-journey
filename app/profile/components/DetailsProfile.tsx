'use client'
import { Pencil } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ProfileForm } from './ProfileForm'

export const DetailsProfile = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [profile, setProfile] = useState({
        name: '',
        username: '',
        birthDate: '',
        gender: '',
        phone: '',
        _id: ''
    })

    const fetchProfile = async () => {
        try {
          const response = await axios.get('/api/profile/details')
          setProfile(response.data.profile)
        } catch (error) {
          console.error(error)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])
  return (
    <motion.div initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className='flex-1 bg-soft-white shadow-md rounded-lg p-5 flex flex-col'>
        {isOpen && <ProfileForm formClose={() => setIsOpen(false)} profileData={profile} updateProfile={fetchProfile}/>}
        <div className='w-full flex justify-between'>
            <div className='text-lg font-semibold'>Profile Details</div>
            <button onClick={() => setIsOpen(true)} className='flex items-center justify-center bg-dark-gray w-8 h-8 rounded-full text-soft-white hover:bg-dark-grayish-blue'>
                <Pencil size={15} />
            </button>
        </div>
        <div className='flex flex-col justify-around flex-1'>
            <div className='flex flex-col sm:flex-row'>
                <div className='w-48 lg:w-60 font-semibold align-middle'>Username</div>
                <div className='flex-1 break-all align-middle'>{profile.username}</div>
            </div>
            <div className='flex flex-col sm:flex-row'>
                <div className='w-48 lg:w-60 font-semibold align-middle'>Name</div>
                <div className='flex-1 break-all align-middle capitalize'>{profile.name}</div>
            </div>
            <div className='flex flex-col sm:flex-row'>
                <div className='w-48 lg:w-60 font-semibold align-middle'>Date of Birth</div>
                <div className='flex-1 break-all align-middle'>{profile.birthDate}</div>
            </div>
            <div className='flex flex-col sm:flex-row'>
                <div className='w-48 lg:w-60 font-semibold align-middle'>Gender</div>
                <div className='flex-1 break-all align-middle capitalize'>{profile.gender}</div>
            </div>
            <div className='flex flex-col sm:flex-row'>
                <div className='w-48 lg:w-60 font-semibold align-middle'>Phone Number</div>
                <div className='flex-1 break-all align-middle'>{profile.phone}</div>
            </div>
        </div>
    </motion.div>
  )
}
