'use client'

import React, { createContext, useState, useRef, ReactNode } from "react";

type AlertStatus = 'None' | 'Success' | 'Error';

interface IAlertContext {
    alert: AlertStatus;
    alertText: string | null;
    success: (text: string, timeout: number) => void;
    error: (text: string, timeout: number) => void;
    clear: () => void;
}

export const AlertContext = createContext<IAlertContext | null>(null);
AlertContext.displayName = 'AlertContext';

const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<AlertStatus>('None');
    const [alertText, setAlertText] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimeoutRef = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    const success = (text: string, timeout: number) => {
        clearTimeoutRef();
        setAlert('Success');
        setAlertText(text);
        timeoutRef.current = setTimeout(() => {
            setAlert('None');
            setAlertText(null);
        }, timeout * 1000);
    }

    const error = (text: string, timeout: number) => {
        clearTimeoutRef();
        setAlert('Error');
        setAlertText(text);
        timeoutRef.current = setTimeout(() => {
            setAlert('None');
            setAlertText(null);
        }, timeout * 1000);
    }

    const clear = () => {
        clearTimeoutRef();
        setAlert('None');
        setAlertText(null);
    }

    const contextValue: IAlertContext = {
        alert,
        alertText,
        success,
        error,
        clear
    }

    return (
        <AlertContext.Provider value={contextValue}>
            {children}
        </AlertContext.Provider>
    )
}

export default AlertProvider