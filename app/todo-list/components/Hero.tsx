'use client'
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckSquare, ListTodo, SendHorizonal, LoaderCircle, Square, X, CalendarX, RotateCw, ChevronUp, ChevronDown, FolderX } from 'lucide-react';
import { motion } from 'framer-motion'
import { AlertContext } from '@/context/AlertContext';

interface TodoItem {
    _id: string;
    title: string;
    time?: string;
    date: string;
    checked: boolean;
    buttonTitle: React.ReactNode;
    ref: React.RefObject<HTMLLIElement>;
}

type InputProps = {
    todoTitle: string;
}

const todoSchema = z.object({
    todoTitle: z.string().min(1, { message: 'This field is required' }),
});

function Hero() {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [missedTodoItems, setMissedTodoItems] = useState<TodoItem[]>([]);
    const [showTime, setShowTime] = useState(false);
    const [timeTitle, setTimeTitle] = useState('today');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const newItemRef = useRef<HTMLLIElement>(null);

    const alertContext = useContext(AlertContext);
    if (!alertContext) return null;
    const { success, error } = alertContext;

    const errorAlert = (message: string, timeout: number) => {
        error(message, timeout);
    };

    const fetchTodoItems = async (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        try {
            const response = await axios.get(`/api/todo/tasks/${dateStr}`);
            const tasks: TodoItem[] = response.data.tasks.map((task: TodoItem) => ({
                _id: task._id,
                title: task.title,
                time: task.time,
                checked: task.checked,
                buttonTitle: task.checked ? <CheckSquare size={20} /> : <Square size={20} />,
            }));
            setTodoItems(tasks);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                errorAlert(error.response?.data.message, 5);
            } else {
                errorAlert('Something went wrong', 5);
            }
        }
    };

    const fetchMissedTodoItems = async () => {
        try {
            const response = await axios.get('/api/todo/missed');
            const tasks: TodoItem[] = response.data.missedTasks.map((task: TodoItem) => ({
                _id: task._id,
                title: task.title,
                date: formatDate(task.date),
                checked: task.checked,
                buttonTitle: <RotateCw size={20} />,
            }))
            setMissedTodoItems(tasks);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                errorAlert(error.response?.data.message, 5);
            } else {
                errorAlert('Something went wrong', 5)
            }
        }
    }

    useEffect(() => {
        fetchTodoItems(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        fetchMissedTodoItems();
    }, []);

    useEffect(() => {
        if (newItemRef.current) {
            newItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [todoItems]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<InputProps>({
        defaultValues: {
            todoTitle: '',
        },
        resolver: zodResolver(todoSchema),
    });

    const onSubmit: SubmitHandler<InputProps> = async (data) => {
        const currTime = new Date().toLocaleTimeString().slice(0, 5);

        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        try {   
            const response = await axios.post('/api/todo/create', { title: data.todoTitle, date: dateStr, time: currTime });
            success(response.data.message, 5);
            const newItem: TodoItem = {
                _id: response.data.id,
                title: data.todoTitle,
                time: currTime,
                date: dateStr,
                checked: false,
                buttonTitle: <Square size={20} />,
                ref: newItemRef,
            };
            setTodoItems([...todoItems, newItem]);

            reset();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                errorAlert(error.response?.data.message, 5);
            } else {
                errorAlert('Something went wrong', 5);
                console.log(error);
            }
        }
    };

    const progressUpdate = async (id: string, checked: boolean, index: number) => {
        const newChecked = !checked;

        const newTodoItems = [...todoItems];
        newTodoItems[index].buttonTitle = <LoaderCircle size={20} className="animate-spin" />;
        setTodoItems(newTodoItems);

        try {
            const response = await axios.patch(`/api/todo/${id}`, { checked: newChecked });
            success(response.data.message, 5);
            newTodoItems[index].checked = newChecked;
            newTodoItems[index].buttonTitle = newChecked ? <CheckSquare size={20} /> : <Square size={20} />;
            setTodoItems(newTodoItems);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                errorAlert(error.response?.data.message, 5);
            } else {
                errorAlert('Something went wrong', 5);
                console.log(error);
            }
        }
    };

    const updateTask = async (id: string) => {
        try {
            const response = await axios.patch(`/api/todo/missed/${id}`);
            success(response.data.message, 5);
            setMissedTodoItems(missedTodoItems.filter((item) => item._id !== id));
            if (timeTitle === 'today') {
                fetchTodoItems(selectedDate);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                errorAlert(error.response?.data.message, 5);
            } else {
                errorAlert('Something went wrong', 5);
            }
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(`/api/todo/${id}`);
            success(response.data.message, 5);
            setTodoItems(todoItems.filter((item) => item._id !== id));
            setMissedTodoItems(missedTodoItems.filter((item) => item._id !== id));
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                errorAlert(error.response?.data.message, 5);
            } else {
                errorAlert('Something went wrong', 5);
                console.log(error);
            }
        }
    };

    const todayHandle = () => {
        setTimeTitle('today');
        setSelectedDate(new Date());
        setShowTime(false);
    };

    const tomorrowHandle = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setTimeTitle('tomorrow');
        setSelectedDate(tomorrow);
        setShowTime(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  return (
    <div className='h-full w-full overflow-y-auto md:overflow-y-hidden scrollbar-hide flex flex-col md:flex-row'>
      <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>
        <div className="px-5 sm:px-10 pt-10 sm:pt-5 pb-5 flex flex-col w-full h-full max-h-full">
            <div className="text-base font-semibold mb-5 flex justify-between items-center">
                <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="flex items-center gap-2">
                    <ListTodo size={24} />
                    <div>Todo List</div>
                </motion.div>
                <div>
                    <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
                        onClick={() => setShowTime(!showTime)}
                        className="relative flex items-center text-dark-gray border-b-2 py-1 border-bright-blue cursor-pointer hover:bg-rainy-day rounded-md px-2"
                    >
                        <div className="mr-3">{timeTitle}</div>
                        {showTime ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        {showTime && (
                            <div className="text-dark-gray absolute top-9 right-0 z-50 bg-bright-blue rounded-sm shadow-sm text-sm">
                                <button className="px-3 py-2 hover:bg-tomb-blue w-full text-soft-white border-b border-soft-white" onClick={todayHandle}>
                                    today
                                </button>
                                <button className="px-3 py-2 hover:bg-tomb-blue w-full text-soft-white" onClick={tomorrowHandle}>
                                    tomorrow
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
            <div className="flex-1 rounded-lg p-3 text-dark-gray overflow-y-hidden">
                <ul className="h-full w-full flex flex-col gap-3 overflow-y-auto scrollbar-hide">
                    {todoItems.length === 0 && <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className='text-sm text-dark-gray/50 w-full h-full flex flex-col justify-center items-center'>
                        <FolderX size={30} />
                        <div>No task yet</div>
                    </motion.div>}
                    {todoItems.map((item, index) => (
                        <motion.li initial={{ y: -20, opacity: 0.5 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
                            ref={item.ref}
                            key={index}
                            className={`p-3 w-full shadow-sm rounded-lg relative flex group ${
                                item.checked ? 'bg-bright-blue' : 'bg-soft-white'
                            }`}
                        >
                            <div className="flex justify-between items-center w-full">
                                <div>
                                    <div className={`text-sm font-semibold mb-2 ${item.checked ? 'line-through' : ''}`}>
                                        {item.title}
                                    </div>
                                    <div className="text-xs">{item.time}</div>
                                </div>
                                <button onClick={() => progressUpdate(item._id, item.checked, index)}>{item.buttonTitle}</button>
                            </div>
                            <button onClick={() => handleDelete(item._id)}>
                                <X
                                    size={15}
                                    className="text-dark-gray/50 hover:text-dark-gray absolute right-1 top-1 hidden group-hover:block"
                                />
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </div>
            <div className="h-12">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full relative">
                    {errors.todoTitle && <div className="text-sm text-tomato absolute -top-6">{errors.todoTitle.message}</div>}
                    <input
                        type="text"
                        {...register('todoTitle')}
                        id="todoTitle"
                        className="h-full w-full rounded-lg px-3 py-2 text-sm border-2 border-bright-blue bg-transparent focus:outline-none focus:border-tomb-blue"
                    />
                    <button type="submit">
                        <SendHorizonal
                            size={20}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-bright-blue hover:scale-110"
                        />
                    </button>
                </form>
            </div>
        </div>
      </div>
      <div className='w-full md:w-1/2 min-h-screen max-h-screen p-3'>
        <div className='px-5 sm:px-10 pt-10 sm:pt-5 pc-5 flex flex-col w-full h-full'>
            <div className='text-base font-semibold mb-5 flex items-center justify-end gap-2'>
                <div>Task Missed</div>
                <CalendarX size={24} />
            </div>
            <div className='flex-1 p-3 text-dark-gray overflow-hidden'>
                <ul className='h-full w-full flex flex-col gap-3 overflow-y-auto scrollbar-hide'>
                    {missedTodoItems.length === 0 && <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className='text-sm text-dark-gray/50 w-full h-full flex flex-col justify-center items-center'>
                        <FolderX size={30} />
                        <div>No Task Missed</div>
                    </motion.div>}
                    {missedTodoItems.map((item, index) => (
                        <motion.li initial={{ x: 20, opacity: 0.5 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} key={index} className='p-3 w-full shadow-sm rounded-lg relative flex group bg-soft-white'>
                            <div className='flex justify-between items-center w-full'>
                                <div>
                                    <div className='text-sm font-semibold mb-2'>{item.title}</div>
                                    <div className="text-xs">{item.date}</div>
                                </div>
                                <button onClick={() => updateTask(item._id)}>{item.buttonTitle}</button>
                            </div>
                            <button onClick={() => handleDelete(item._id)}>
                                <X size={15} className='text-dark-gray/50 hover:text-dark-gray absolute right-1 top-1 hidden group-hover:block' />
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Hero