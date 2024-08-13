'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { CalendarHeart, Goal, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion'

export const FirstHero = () => {
    const [todoProgress, setTodoProgress] = useState(0);
    const [todoEndValue, setTodoEndValue] = useState(0);
    const [monthlyEndValue, setMonthlyEndValue] = useState(0);
    const [monthlyProgress, setMonthlyProgress] = useState(0);
    const [goalEndValue, setGoalEndValue] = useState(0);
    const [goalProgress, setGoalProgress] = useState(0);
    const [shuffledMotivation, setShuffledMotivation] = useState<string[]>([]);

    const { username } = useAuth();

    const getGreetingTime = () => {
        const currentHour = new Date().getHours();

        if (currentHour >= 6 && currentHour < 12) {
            return 'Good morning';
        } else if (currentHour >= 12 && currentHour < 16) {
            return 'Good afternoon';
        } else {
            return 'Good evening';
        }
    };

    const motivations = [
        'Never give up',
        'Your potential is the limit of your failure',
        'You are never too old to set another goal or to dream a new dream',
        'The only way to do great work is to love what you do',
        'Happiness is not something ready made. It comes from your own actions',
        'You miss 100% of the shots you don’t take',
        'The only thing we have to fear is fear itself',
        'The only way to do great work is to love what you do',
        'Success usually comes to those who are too busy to be looking for it',
        'The future belongs to those who believe in the beauty of their dreams',
    ];

    const shuffleArray = (array: string[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        setShuffledMotivation(shuffleArray([...motivations]));
    }, []);

    const getSummary = async () => {
        try {
            const response = await axios.get('api/dashboard')
            setTodoEndValue(Math.floor(response.data.taskCompletedPercentage));
            setMonthlyEndValue(Math.floor(response.data.planCompletedPercentage));
            setGoalEndValue(Math.floor(response.data.goalCompletedPercentage)); 
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSummary();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTodoProgress((prev) => (prev < todoEndValue ? prev + 1 : prev));
            setMonthlyProgress((prev) => (prev < monthlyEndValue ? prev + 1 : prev));
            setGoalProgress((prev) => (prev < goalEndValue ? prev + 1 : prev));
        }, 20);

        return () => clearInterval(interval);
    }, [todoEndValue, monthlyEndValue, goalEndValue]);

    return (
        <>
            <div className='p-5 sm:p-10 pt-10 sm:pt-5'>
                <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='text-3xl text-dark-gray font-semibold'>{getGreetingTime()}, {username}</motion.div>
                <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className='text-xl text-bright-blue font-semibold'>{shuffledMotivation[0]}</motion.div>
            </div>
            <div className='p-5 sm:p-10 flex flex-col gap-3 text-dark-gray'>
                <motion.div initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='h-20 bg-soft-white p-3 rounded-lg shadow-md hover:bg-light-gray transition-colors duration-300 flex justify-between items-center group'>
                    <div className='text-base font-semibold flex items-center gap-2'>
                        <ListTodo size={20} />
                        <div>ToDo List</div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='relative w-14 h-14 rounded-full flex justify-center items-center after:absolute after:content-[""] after:w-12 after:h-12 after:rounded-full after:bg-soft-white group-hover:after:bg-light-gray after:transition-colors after:duration-300' style={{ background: `conic-gradient(#00abe4 ${todoProgress * 3.6}deg, #e9f1fa ${todoProgress * 3.6}deg)` }}>
                            <span className='font-semibold text-dark-gray text-sm z-50 group-hover:scale-110 transition-transform duration-300'>{todoProgress}%</span>
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className='h-20 bg-soft-white p-3 rounded-lg shadow-md hover:bg-light-gray transition-colors duration-300 flex justify-between items-center group'>
                    <div className='text-base font-semibold flex items-center gap-2'>
                        <CalendarHeart size={20} />
                        <div>Monthly Plan</div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='relative w-14 h-14 rounded-full flex justify-center items-center after:absolute after:content-[""] after:w-12 after:h-12 after:rounded-full after:bg-soft-white group-hover:after:bg-light-gray after:transition-colors after:duration-300' style={{ background: `conic-gradient(#00abe4 ${monthlyProgress * 3.6}deg, #e9f1fa ${monthlyProgress * 3.6}deg)` }}>
                            <span className='font-semibold text-dark-gray text-sm z-50 group-hover:scale-110 transition-transform duration-300'>{monthlyProgress}%</span>
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className='h-20 bg-soft-white p-3 rounded-lg shadow-md hover:bg-light-gray transition-colors duration-300 flex justify-between items-center group'>
                    <div className='text-base font-semibold flex items-center gap-2'>
                        <Goal size={20} />
                        <div>Goals</div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='relative w-14 h-14 rounded-full flex justify-center items-center after:absolute after:content-[""] after:w-12 after:h-12 after:rounded-full after:bg-soft-white group-hover:after:bg-light-gray after:transition-colors after:duration-300' style={{ background: `conic-gradient(#00abe4 ${goalProgress * 3.6}deg, #e9f1fa ${goalProgress * 3.6}deg)` }}>
                            <span className='font-semibold text-dark-gray text-sm z-50 group-hover:scale-110 transition-transform duration-300'>{goalProgress}%</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};
