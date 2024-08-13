import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSidebar } from "@/context/SidebarContext";

interface SidebarItemProps {
    icon: React.ReactNode;
    text?: string;
    hasAlert?: boolean;
    path?: string;
}

const SidebarItemExtended: React.FC<SidebarItemProps> = ({ icon: Icon, text, hasAlert, path }) => {
    const isActive = path === usePathname();
    return (
        <Link href={path || '#'} passHref>
            <li className={`flex px-3 py-2 mb-1 rounded-lg items-center relative font-medium group ${isActive ? 'bg-bright-blue hover:bg-tomb-blue text-soft-white' : 'hover:bg-rainy-day text-dark-gray'}`}>
                <div className="group-hover:scale-125 group-hover:-rotate-6">{Icon}</div>
                <span className='ml-2'>{text}</span>
                {hasAlert && <div className={`absolute w-2 h-2 rounded bg-bright-blue right-2`}></div>}
            </li>
        </Link>
    )
}

export default SidebarItemExtended;

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, text, hasAlert, path }) => {
    const { extended } = useSidebar();
    const isActive = path === usePathname();
    return (
        <Link href={path || '#'} passHref>
            <li className={`flex px-3 py-2 mb-1 rounded-lg items-center relative group ${isActive ? 'bg-bright-blue hover:bg-tomb-blue text-soft-white' : 'hover:bg-rainy-day'}`}>
                <div className="group-hover:scale-125 group-hover:-rotate-6">{Icon}</div>
                {hasAlert && <div className={`absolute w-2 h-2 rounded bg-bright-blue top-2 right-2`}></div>}
                {!extended && <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-dark-gray text-soft-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-[200]`}>
                    {text}
                </div>}
            </li>
        </Link>
    )
}