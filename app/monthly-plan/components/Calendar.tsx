import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface PlanType {
  _id: string;
  title: string;
  count: number;
  checked: boolean;
}

interface CalendarProps {
  onButtonClick: (date: string) => void;
}

// eslint-disable-next-line react/display-name
const Calendar = forwardRef(({ onButtonClick }: CalendarProps, ref) => {
  // Mendapatkan tanggal hari ini
  const currentDate = new Date();
  const [displayMonth, setDisplayMonth] = useState(currentDate.getMonth());
  const [displayYear, setDisplayYear] = useState(currentDate.getFullYear());
  const [plans, setPlan] = useState<PlanType[]>([]);

  const fetchPlan = async () => {
    try {
      const response = await axios.get('/api/plan');
      setPlan(response.data.uniqueDates);
    } catch (error) {
      console.log(error);
    }
  }

  useImperativeHandle(ref, () => ({
    updateCalendar: () => {
      fetchPlan();
    }
  }));

  useEffect(() => {
    fetchPlan();
  }, [displayMonth, displayYear]);

  // Mendapatkan jumlah hari dalam bulan ini
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  // Mendapatkan hari pertama dalam bulan ini
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();

  // Membuat array kosong untuk tabel kalender
  const calendar = [];
  let rows = [];

  // Menambahkan hari-hari pertama sebelum tanggal pertama bulan
  for (let i = 0; i < firstDayOfMonth; i++) {
    rows.push(<td key={-i} className="border border-dark-gray/30 h-20 bg-rainy-day/50"></td>);
  }

  // Menambahkan hari dalam bulan ke dalam array kalender
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === currentDate.getDate() && displayMonth === currentDate.getMonth() && displayYear === currentDate.getFullYear();
    const year = displayYear;
    const month = displayMonth + 1;
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${dayStr}`;

    const plan = plans.find((p) => p._id === dateStr);
    const title = plan ? plan.title : '';
    const checked = plan ? plan.checked : false;
    let count

    if (plan) {
      const calculatedCount = plan.count - 1;
      count = calculatedCount === 0 ? '' : calculatedCount;
    } else {
      count = '';
    }

    const displayCount = count !== '' ? `+${count}` : '';

    rows.push(
      <td key={day} onClick={() => onButtonClick(dateStr)} className={`border border-dark-gray/30 h-20 text-left align-top text-sm p-2 hover:bg-rainy-day cursor-pointer`}>
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} className={`h-5 w-5 flex justify-center items-center rounded-full ${isToday ? 'bg-bright-blue group-hover:bg-tomb-blue text-soft-white' : ''}`}>{day}</motion.div>
        <div className='group relative'>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} className={`text-ellipsis overflow-hidden whitespace-nowrap pl-1 text-sm text-bright-blue ${checked ? 'line-through' : ''}`}>{title}</motion.div>
          {title !== '' && <div className='absolute bottom-full rounded-md px-2 py-2 invisible group-hover:visible opacity-20 group-hover:opacity-100 translate-y-3 group-hover:-translate-y-0 transition-all bg-dark-gray text-soft-white'>{title}</div>}
        </div>
        <div className='w-full flex justify-end items-center'>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.75 }} className={`h-5 w-5 rounded-full ${count !== '' ? 'bg-rainy-day font-semibold text-xs flex justify-center items-center' : ''}`}>{displayCount}</motion.div>
        </div>
      </td>
    );
    if ((firstDayOfMonth + day - 1) % 7 === 6) {
      calendar.push(<tr key={day}>{rows}</tr>);
      rows = [];
    }
  }

  // Menambahkan baris terakhir jika tidak penuh
  if (rows.length > 0) {
    calendar.push(<tr key="last">{rows}</tr>);
  }

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handleToday = () => {
    setDisplayMonth(currentDate.getMonth());
    setDisplayYear(currentDate.getFullYear());
  };

  return (
    <div className='text-dark-gray flex flex-col h-full overflow-y-auto scrollbar-hide'>
      <div className='w-full rounded-t-lg border-t border-x border-dark-gray/30 h-14 flex items-center justify-between px-3 py-2'>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} className='font-semibold text-base'>{new Date(displayYear, displayMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</motion.div>
        <div className='flex justify-center items-center h-full font-semibold text-soft-white text-sm'>
            <button onClick={handlePrevMonth} className='bg-bright-blue hover:bg-tomb-blue h-full w-8 flex items-center justify-center rounded-l-lg'><ChevronLeft size={15} /></button>
            <button onClick={handleToday} className='bg-bright-blue hover:bg-tomb-blue h-full px-3 flex items-center justify-center'>Today</button>
            <button onClick={handleNextMonth} className='bg-bright-blue hover:bg-tomb-blue h-full w-8 flex items-center justify-center rounded-r-lg'><ChevronRight size={15} /></button>
        </div>
      </div>
      <div className='w-full flex-1'>
        <table className='table-fixed w-full border-collapse border border-dark-gray/30'>
          <thead>
            <tr className='bg-dark-gray/5'>
              <th className='border border-dark-gray/30 text-sm'>Sun</th>
              <th className='border border-dark-gray/30 text-sm'>Mon</th>
              <th className='border border-dark-gray/30 text-sm'>Tue</th>
              <th className='border border-dark-gray/30 text-sm'>Wed</th>
              <th className='border border-dark-gray/30 text-sm'>Thu</th>
              <th className='border border-dark-gray/30 text-sm'>Fri</th>
              <th className='border border-dark-gray/30 text-sm'>Sat</th>
            </tr>
          </thead>
          <tbody>{calendar}</tbody>
        </table>
      </div>
    </div>
  );
});

export { Calendar };