'use client';

import React, { createContext } from "react";

interface SidebarContextProps {
    extended: boolean;
    setExtended: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [extended, setExtended] = React.useState(false);

    return (
        <SidebarContext.Provider value={{ extended, setExtended }}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = (): SidebarContextProps => {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }

    return context;
}