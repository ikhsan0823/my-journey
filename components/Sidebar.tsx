'use client';
import React from 'react'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';

import { CalendarHeart, Camera, Goal, Home, ListTodo, LogOut, Menu, Notebook, PencilLine, Settings, User, X } from 'lucide-react';

import SidebarItemExtended, { SidebarItem } from './SidebarItem';
import { useSidebar } from '@/context/SidebarContext';

export const Sidebar: React.FC = () => {
  const [showLogout, setShowLogout] = React.useState(false);
  const {extended, setExtended} = useSidebar();
  const pathname = usePathname();

  const publicPath = pathname === '/' || pathname === '/register';
  const isRegister = pathname === '/register';

  const showLogoutModal = () => {
    setShowLogout(true);
  }

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/logout');
      if (response.status === 200) {
        console.log(response.data);
        window.location.reload();
      }
    } catch (error) {
      return console.log(error);
    }
  }

  return (
    <>
      {showLogout &&
        (
          <>
            <div className={`h-screen w-full absolute z-[180] bg-dark-gray/50 transition-all duration-300 ease-out`}></div>
            <div className='absolute top-3 left-1/2 -translate-x-1/2 bg-soft-white rounded-lg shadow-md z-[200] transition-all duration-300 ease-in-out w-72'>
              <div className='w-full h-full relative p-5 pt-8'>
                <button className='absolute top-2 right-2 text-dark-gray/50 hover:text-dark-gray'><X size={15} onClick={() => setShowLogout(false)} /></button>
                <div className='text-dark-gray text-base mb-3'>Are you sure you want to logout?</div>
                <motion.button whileTap={{ scale: 0.8 }} className='px-3 py-2 bg-bright-blue hover:bg-tomb-blue rounded-lg font-semibold text-sm text-soft-white w-full' onClick={handleLogout}>Logout</motion.button>
              </div>
            </div>
          </>
        )
      }
      <aside className='shadow-none sm:shadow-md h-fit sm:h-full absolute top-0 left-0 sm:static w-fit bg-transparent sm:bg-light-blue'>
        <nav className='p-3'>
          <div className='flex items-center justify-center'>
            <button onClick={() => setExtended(true)} className={`${isRegister ? 'sm:text-dark-gray text-soft-white': 'text-dark-gray'} rounded-full hover:bg-rainy-day p-1 mb-0 sm:mb-3`}><Menu size={20} /></button>
          </div>
          <ul className='hidden sm:block'>
            {publicPath ? (
              <SidebarItem icon={<Home size={20} />} text='Welcome' path='/' />
            ) : (
              <>
                <SidebarItem icon={<Home size={20} />} text='Home' path='/home' />
                <SidebarItem icon={<ListTodo size={20} />} text='ToDo List' path='/todo-list' hasAlert />
                <SidebarItem icon={<CalendarHeart size={20} />} text='Monthly Plan' path='/monthly-plan' />
                <SidebarItem icon={<Goal size={20} />} text='Goals' path='/goals' />
              </>
            )}
          </ul>
        </nav>
      </aside>
      <div onClick={() => setExtended(false)} className={`h-screen w-full absolute z-50 bg-dark-gray/50 transition-all duration-300 ease-out ${extended ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}></div>
      <aside className={`text-sm w-64 h-full bg-light-blue z-[100] transition-all duration-300 ease-out absolute top-0 ${ extended ? 'left-0' : '-left-72' }`}>
        <nav className='p-3 flex flex-col h-full w-full'>
          <div className='flex justify-between mb-3'>
            <Image src="/next.svg" alt="logo" width={50} height={50} loading='eager' />
            <button className='rounded-full hover:bg-rainy-day p-1 text-dark-gray' onClick={() => setExtended(false)}><Menu size={20} /></button>
          </div>
          <ul className='flex-1'>
            {publicPath ? (
              <>
                <SidebarItemExtended icon={<Home size={20} />} text='Welcome' path='/' />
                <div className='w-full h-1 border-b border-dark-gray/50 pt-2 mb-3'></div>
                <SidebarItemExtended icon={<PencilLine size={20} />} text='Register' path='/register' />
              </>
            ) : (
              <>
                <SidebarItemExtended icon={<Home size={20} />} text='Home' path='/home' />
                <SidebarItemExtended icon={<ListTodo size={20} />} text='ToDo List' path='/todo-list' hasAlert />
                <SidebarItemExtended icon={<CalendarHeart size={20} />} text='Monthly Plan' path='/monthly-plan' />
                <SidebarItemExtended icon={<Goal size={20} />} text='Goals' path='/goals' />
                <div className='w-full h-1 border-b border-dark-gray/50 pt-2 mb-3'></div>
                <SidebarItemExtended icon={<Camera size={20} />} text='Sweet Memory' path='/sweet-memory' />
                <SidebarItemExtended icon={<Notebook size={20} />} text='Notes' path='/notes' />
                <div className='w-full h-1 border-b border-dark-gray/50 pt-2 mb-3'></div>
                <SidebarItemExtended icon={<User size={20} />} text='Profile' path='/profile' />
                <SidebarItemExtended icon={<Settings size={20} />} text='Settings' path='/settings' />
                <div onClick={showLogoutModal}><SidebarItemExtended icon={<LogOut size={20} />} text='Logout' /></div>
              </>
            )}
          </ul>
        </nav>
      </aside>
    </>
  )
}
