import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export default function Signup() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const containerRef = useRef<HTMLDivElement>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.auth-reveal',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        await register(name, email);
        setIsLoading(false);

        // Redirect back where they came from or to home
        const redirectUrl = searchParams.get('redirect') || '/';
        navigate(redirectUrl);
    };

    return (
        <div ref={containerRef} className="bg-[#f8f7f5] min-h-screen flex flex-col pt-32 pb-24 px-4">
            <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
                <div className="text-center mb-12 auth-reveal">
                    <div className="w-16 h-16 bg-moss/10 rounded-full flex items-center justify-center mx-auto text-moss mb-6">
                        <UserPlus size={24} />
                    </div>
                    <h1 className="font-serif italic text-4xl text-charcoal mb-4">Initialize Profile.</h1>
                    <p className="font-sans text-sm text-charcoal/60">Register for secure clinical access and automated insights.</p>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-stone/20 border border-stone/50 auth-reveal">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-mono text-[10px] tracking-widest uppercase text-clay font-bold mb-2 ml-4">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full px-6 py-4 bg-[#f8f7f5] rounded-2xl border border-transparent focus:outline-none focus:border-moss transition-colors font-sans text-sm"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] tracking-widest uppercase text-clay font-bold mb-2 ml-4">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-6 py-4 bg-[#f8f7f5] rounded-2xl border border-transparent focus:outline-none focus:border-moss transition-colors font-sans text-sm"
                            />
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] tracking-widest uppercase text-clay font-bold mb-2 ml-4">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 bg-[#f8f7f5] rounded-2xl border border-transparent focus:outline-none focus:border-moss transition-colors font-sans text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-moss text-white py-4 rounded-2xl font-mono text-[10px] tracking-widest uppercase font-bold flex items-center justify-center gap-4 hover:bg-charcoal transition-colors disabled:opacity-50 mt-6"
                        >
                            {isLoading ? 'Processing...' : 'Create Account'} <ArrowRight size={14} />
                        </button>
                    </form>

                    <p className="mt-8 text-center font-sans text-sm text-charcoal/60">
                        Already registered?{' '}
                        <Link to={`/login${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`} className="text-moss font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
