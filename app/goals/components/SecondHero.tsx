'use client'
import { CheckSquare, Square, Trophy, View, X } from 'lucide-react'
import React,{ useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

type Goal = {
    _id: string;
    userId: string;
    priority: 'High' | 'Medium' | 'Low';
    category: string;
    goals: string;
    reason: string;
    startTime: string;
    completionDate: string;
    steps: { id: string, step: string, completed: boolean }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    completionPercentage: number;
};


export const SecondHero = ({ formSubmitted }: { formSubmitted: boolean}) => {
    const [priority, setPriority] = useState('High')
    const [highPriorityGoals, setHighPriorityGoals] = useState([]);
    const [mediumPriorityGoals, setMediumPriorityGoals] = useState([]);
    const [lowPriorityGoals, setLowPriorityGoals] = useState([]);
    const [goalDetails, setGoalDetails] = useState<Goal | null>(null);
    const [showDetails, setShowDetails] = useState(false);


    const fetchData = async () => {
        try {
            const response = await axios.get("api/goals");

            const calculateCompletionPercentage = (steps: { completed: boolean }[]) => {
                const totalSteps = steps.length;
                const completedSteps = steps.filter(step => step.completed).length;
                const percentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
                return Math.round(percentage);
            };

             const modifiedGoals = response.data.goals.map((goal: Goal) => ({
                ...goal,
                completionPercentage: calculateCompletionPercentage(goal.steps)
            }));

            const highPriority = modifiedGoals.filter((goal: Goal) => goal.priority === 'High');
            const mediumPriority = modifiedGoals.filter((goal: Goal) => goal.priority === 'Medium');
            const lowPriority = modifiedGoals.filter((goal: Goal) => goal.priority === 'Low');

            setHighPriorityGoals(highPriority);
            setMediumPriorityGoals(mediumPriority);
            setLowPriorityGoals(lowPriority);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [formSubmitted]);

    const handleDetails = (goal: Goal) => {
        setGoalDetails(goal);
        setShowDetails(true);
    }

    const goalStepCompletedHandle = async (id: string, completed: boolean) => {
        const newCompleted = !completed;
        try {
            const response = await axios.patch(`api/goals/${id}`, { completed: newCompleted });
            console.log(response.data);

            if (goalDetails) {
                const updatedSteps = goalDetails.steps.map(step => 
                    step.id === id ? { ...step, completed: newCompleted } : step
                );

                setGoalDetails({
                    ...goalDetails,
                    steps: updatedSteps,
                });
            }

            fetchData();
        } catch (error) {
            console.log(error);
        }
    }

    const goalDeleteHandle = async (id: string) => {
        try {
            const response = await axios.delete(`api/goals/${id}`);
            console.log(response.data);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='px-5 sm:px-10 pt-5 pb-5 flex flex-col w-full h-full'>
        {showDetails && (
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-soft-white rounded-lg shadow-md'>
                <div className='w-72 relative p-5'>
                    <X size={15} className='absolute top-3 right-3 text-dark-gray/50 hover:text-dark-gray cursor-pointer' onClick={() => setShowDetails(false)} />
                    <div className='text-xs font-semibold flex gap-2 items-center'>
                        <Trophy size={15} />
                        <div>{new Date(goalDetails!.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div className='text-lg font-semibold mb-2'>{goalDetails!.goals}</div>
                    <div className='text-sm bg-bright-blue w-fit px-2 rounded-md mb-5 text-soft-white'>{goalDetails!.category}</div>
                    <div className='text-sm mb-3'>Start at {new Date(goalDetails!.startTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div>
                        <div className='text-sm mb-2 font-semibold'>Your Goal Steps</div>
                        {goalDetails!.steps.map((step, index) => (
                            <div key={index} className={`mb-3 px-2 py-1 border border-bright-blue rounded-lg ${step.completed ? 'bg-bright-blue text-soft-white' : 'text-dark-gray'}`}>
                                <div className='flex justify-between items-center'>
                                    <div className={`text-sm ${step.completed ? 'line-through' : ''}`}>{step.step}</div>
                                    <button onClick={() => goalStepCompletedHandle(step.id, step.completed)}>{step.completed ? <CheckSquare size={15} /> : <Square size={15} />}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='w-full flex justify-end items-center'>
                        <button onClick={() => goalDeleteHandle(goalDetails!._id)} className='text-sm text-tomato hover:text-light-red'>Delete</button>
                    </div>
                </div>
            </div>
        )}
        <div>
            <div className='flex justify-end sm:justify-start items-center mb-4'>
                <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className='text-base font-semibold flex items-center gap-2 flex-row-reverse sm:flex-row'>
                    <View size={24} />
                    <div>My Goals Overview</div>
                </motion.div>
            </div>
            <div className='border-2 border-bright-blue w-fit rounded-lg h-10'>
                <button onClick={() => setPriority('High')} className={`text-base h-full w-[70px] ${priority === 'High' ? 'bg-bright-blue text-soft-white' : ' text-dark-gray'}`}>High</button>
                <button onClick={() => setPriority('Medium')} className={`text-base h-full w-[70px] border-x-2 border-bright-blue ${priority === 'Medium' ? 'bg-bright-blue text-soft-white' : ' text-dark-gray'}`}>Medium</button>
                <button onClick={() => setPriority('Low')} className={`text-base h-full w-[70px] ${priority === 'Low' ? 'bg-bright-blue text-soft-white' : ' text-dark-gray'}`}>Low</button>
            </div>
        </div>
        <div className='flex-1 flex flex-col px-3 mt-5'>
            <ul className='w-full'>
                {priority === 'High' && highPriorityGoals.map((goal: Goal) => (
                    <motion.li initial={{x: -50, opacity: 0}} whileInView={{x:0, opacity: 1}} transition={{duration: 0.5}} key={goal._id} onClick={() => handleDetails(goal)} className='flex items-center gap-3 mb-2 border border-dark-gray text-dark-gray p-2 rounded-lg w-full cursor-pointer'>
                        <div className='flex flex-col items-center justify-center font-semibold text-sm'>
                            <Trophy size={20} />
                            <div>{new Date(goal.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        </div>
                        <div className='font-semibold flex-1'>
                            <div className='text-sm flex justify-between'>
                                <div className='text-sm mr-2'>Start at {new Date(goal.startTime).toLocaleDateString('en-Us', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                <div className='text-sm'>Progress at {goal.completionPercentage}%</div>
                            </div>
                            <div className='text-base mt-2'>{goal.goals}</div>
                        </div>
                    </motion.li>
                ))}
                {priority === 'Medium' && mediumPriorityGoals.map((goal: Goal) => (
                    <motion.li initial={{x: -50, opacity: 0}} whileInView={{x:0, opacity: 1}} transition={{duration: 0.5}} key={goal._id} onClick={() => handleDetails(goal)} className='flex items-center gap-3 mb-2 border border-dark-gray text-dark-gray p-2 rounded-lg w-full cursor-pointer'>
                        <div className='flex flex-col items-center justify-center font-semibold text-sm'>
                            <Trophy size={20} />
                            <div>{new Date(goal.completionDate).toLocaleDateString('en-Us', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        </div>
                        <div className='font-semibold flex-1'>
                            <div className='text-sm flex justify-between'>
                                <div className='text-sm mr-2'>Start at {new Date(goal.startTime).toLocaleDateString('en-Us', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                <div className='text-sm'>Progress at {goal.completionPercentage}%</div>
                            </div>
                            <div className='text-base mt-2'>{goal.goals}</div>
                        </div>
                    </motion.li>
                ))}
                {priority === 'Low' && lowPriorityGoals.map((goal: Goal) => (
                    <motion.li initial={{x: -50, opacity: 0}} whileInView={{x:0, opacity: 1}} transition={{duration: 0.5}} key={goal._id} onClick={() => handleDetails(goal)} className='flex items-center gap-3 mb-2 border border-dark-gray text-dark-gray p-2 rounded-lg w-full cursor-pointer'>
                        <div className='flex flex-col items-center justify-center font-semibold text-sm'>
                            <Trophy size={20} />
                            <div>{new Date(goal.completionDate).toLocaleDateString('en-Us', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        </div>
                        <div className='font-semibold flex-1'>
                            <div className='text-sm flex justify-between'>
                                <div className='text-sm mr-2'>Start at {new Date(goal.startTime).toLocaleDateString('en-Us', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                <div className='text-sm'>Progress at {goal.completionPercentage}%</div>
                            </div>
                            <div className='text-base mt-2'>{goal.goals}</div>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </div>
    </div>
  )
}
