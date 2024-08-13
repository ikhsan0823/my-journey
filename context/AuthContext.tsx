'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/Loader";

interface AuthContextProps {
    username: string | null;
    setUsername: (username: string | null) => void;
    fetchData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get("api/users");
            if (response.status === 200) {
                setUsername(response.data.user.username);
                setLoading(false);
            } else {
                setUsername(null);
                setLoading(false);
            }
        } catch (error) {
            setUsername(null);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AuthContext.Provider value={{ username, setUsername, fetchData }}>
            {loading ? (
                <div className="w-full h-screen relative">
                    <Loader />
                </div>
            ) : children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;