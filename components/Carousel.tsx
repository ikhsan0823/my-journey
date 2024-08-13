'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

type CarouselProps = {
    children: React.ReactNode[];
    autoSlide: boolean;
    autoSlideInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ children: slides, autoSlide=false, autoSlideInterval=5000 }) => {
    const [curr, setCurr] = React.useState<number>(0)

    const prev = () => setCurr((curr) => (curr === 0 ? slides?.length - 1 : curr - 1))
    const next = () => setCurr((curr) => (curr === slides?.length - 1 ? 0 : curr + 1))

    React.useEffect(() => {
        if (!autoSlide) return

        const slideInterval = setInterval(() => {
            next()
        }, autoSlideInterval);

        return () => {
            clearInterval(slideInterval)
        };
    }, [curr, autoSlide, autoSlideInterval])
    return (
        <motion.div initial={{ y: -50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className='overflow-hidden relative'>
            <div className='flex transition-transform ease-out duration-500' style={{ transform: `translateX(-${100 * curr}%)` }}>{slides.map((slide, index) => (
                <div key={index} className='min-w-full flex justify-center items-center'>{slide}</div>
            ))}</div>
            <div className='absolute inset-0 flex items-center justify-between p-4'>
                <button onClick={prev} className='p-1 rounded-full shadow bg-soft-white/30 text-dark-gray hover:bg-soft-white'>
                    <ChevronLeft size={25} />
                </button>
                <button onClick={next} className='p-1 rounded-full shadow bg-soft-white/30 text-dark-gray hover:bg-soft-white'>
                    <ChevronRight size={25} />
                </button>
            </div>
            <div className='absolute bottom-4 right-0 left-0'>
                <div className='flex items-center justify-center gap-2'>
                    {slides.map((_, i) => (
                        <div key={i} className={`transition-all w-2 h-2 bg-soft-white rounded-full ${curr === i ? 'p-1' : 'bg-opacity-50'}`} />
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default Carousel;
