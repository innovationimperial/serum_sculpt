import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { useConvex } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

interface User {
    _id: Id<"users">;
    name: string;
    email: string;
    avatar: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_ID_KEY = 'serum_sculpt_user_id';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const convex = useConvex();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const storedId = localStorage.getItem(USER_ID_KEY);
        if (storedId) {
            convex.query(api.auth.getUser, { id: storedId as Id<"users"> })
                .then((u) => {
                    if (u) setUser(u as User);
                    else localStorage.removeItem(USER_ID_KEY);
                })
                .catch(() => localStorage.removeItem(USER_ID_KEY))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [convex]);

    const login = useCallback(async (email: string, password: string) => {
        const result = await convex.query(api.auth.login, { email, password });
        setUser(result as User);
        localStorage.setItem(USER_ID_KEY, result._id);
    }, [convex]);

    const register = useCallback(async (name: string, email: string, password: string) => {
        const result = await convex.mutation(api.auth.register, { name, email, password });
        if (result) {
            setUser(result as User);
            localStorage.setItem(USER_ID_KEY, result._id);
        }
    }, [convex]);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(USER_ID_KEY);
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            isLoading,
        }),
        [user, login, register, logout, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
