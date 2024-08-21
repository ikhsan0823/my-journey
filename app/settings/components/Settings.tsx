'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, Settings } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { EmailForm } from './EmailForm'
import { PasswordForm } from './PasswordForm'

const SettingsComponent = () => {
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const { email } = useAuth()
  return (
    <div className='px-5 sm:px-10 pt-5 pb-5 flex flex-col w-full h-full'>
        {showEmailForm && <EmailForm closeForm={() => setShowEmailForm(false)} />}
        {showPasswordForm && <PasswordForm closeForm={() => setShowPasswordForm(false)} />}
        <div className='text-base font-semibold mb-5 flex justify-end sm:justify-start items-center'>
        <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='flex items-center gap-2 flex-row-reverse sm:flex-row'>
          <Settings size={24} />
          <div>Settings</div>
        </motion.div>
      </div>
      <div className='w-full'>
        <div className='flex flex-col justify-center h-full w-full lg:w-[600px] mx-auto gap-5'>
            <div className='w-full'>
                <div className='flex justify-between flex-col sm:flex-row'>
                    <div>
                        <button onClick={() => setShowEmailForm(true)} className='flex items-center gap-2 text-bright-blue'>
                            <Mail size={20} />
                            <div>Change Email</div>
                        </button>
                    </div>
                    <div className='text-sm text-dark-gray/50'>{email}</div>
                </div>
            </div>
             <div>
                <button onClick={() => setShowPasswordForm(true)} className='flex items-center gap-2 text-bright-blue'>
                    <Lock size={20} />
                    <div>Change Password</div>
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsComponent