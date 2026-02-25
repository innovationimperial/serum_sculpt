import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => Promise<void>;
    register: (name: string, email: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string) => {
        // Dummy login, just use the email name part as the name
        const nameFallback = email.split('@')[0];
        setUser({
            id: Math.random().toString(36).substr(2, 9),
            name: nameFallback.charAt(0).toUpperCase() + nameFallback.slice(1),
            email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameFallback)}&background=2e4036&color=fff`,
        });
    };

    const register = async (name: string, email: string) => {
        // Dummy register
        setUser({
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2e4036&color=fff`,
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
