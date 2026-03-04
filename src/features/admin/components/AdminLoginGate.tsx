import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'adminPamela@serumandsculpt';
const AUTH_KEY = 'adminAuth';

export const AdminLoginGate: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => sessionStorage.getItem(AUTH_KEY) === 'true',
    );
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);

    if (isAuthenticated) return <Outlet />;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            setIsAuthenticated(true);
        } else {
            setError('Invalid username or password');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal/95 to-moss/30 flex items-center justify-center px-4">
            <div
                className={`w-full max-w-md transition-transform ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
            >
                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-moss/20 border border-moss/30 mb-4">
                        <Lock className="w-7 h-7 text-moss" />
                    </div>
                    <h1 className="font-serif italic text-3xl text-white">Admin Portal</h1>
                    <p className="text-sm font-sans text-white/40 mt-2 tracking-wide uppercase">
                        Serum &amp; Sculpt
                    </p>
                </div>

                {/* Login Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl space-y-6"
                >
                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm font-sans">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label className="block text-xs font-sans font-bold uppercase tracking-widest text-white/50 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-sans placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-moss/50 focus:border-moss/50 transition-all"
                            placeholder="Enter username"
                            autoFocus
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-sans font-bold uppercase tracking-widest text-white/50 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white font-sans placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-moss/50 focus:border-moss/50 transition-all"
                                placeholder="Enter password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-moss text-white py-3.5 rounded-xl text-sm font-sans font-bold uppercase tracking-widest hover:bg-moss/80 transition-colors cursor-pointer"
                    >
                        Sign In
                    </button>
                </form>
            </div>

            {/* Shake animation keyframes */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-10px); }
                    40% { transform: translateX(10px); }
                    60% { transform: translateX(-6px); }
                    80% { transform: translateX(6px); }
                }
            `}</style>
        </div>
    );
};
