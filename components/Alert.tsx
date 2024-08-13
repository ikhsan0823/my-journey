'use client'

import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertContext } from '@/context/AlertContext';

const AlertDisplay: React.FC = () => {
    const alertContext = useContext(AlertContext);

    if (!alertContext) return null;

    const { alert, alertText, clear } = alertContext;

    return (
        <AnimatePresence>
            {alert !== 'None' && (
                <motion.div
                    initial={{ x: 500, opacity: 1 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 500, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className='flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs z-[250] absolute top-2 right-2 shadow-sm'
                >
                    <div className={`cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg px-[10px] ${alert === "Success" ? "bg-bright-blue" : "bg-tomato"}`}>
                        <div className='flex gap-2'>
                            <div className={`text-soft-white backdrop-blur-xl p-1 rounded-lg ${alert === "Success" ? "bg-tomb-blue" : "bg-light-red"}`}>
                                {alert === "Success" ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 12.75 6 6 9-13.5"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                        />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <p className='text-soft-white font-semibold'>{alert}</p>
                                <p className='text-soft-white'>{alertText}</p>
                            </div>
                        </div>
                        <button onClick={clear} className={`text-soft-white p-1 rounded-md transition-colors ease-linear ${alert === 'Success' ? "hover:bg-tomb-blue" : "hover:bg-light-red"}`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertDisplay;