import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface AdminTopbarProps {
    title: string;
    onMenuToggle: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ title, onMenuToggle }) => {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-charcoal/5 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Left: hamburger + title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden p-2 text-charcoal/50 hover:text-charcoal transition-colors cursor-pointer"
                    aria-label="Toggle menu"
                >
                    <Menu size={20} />
                </button>
                <h2 className="font-serif italic text-xl text-charcoal">{title}</h2>
            </div>

            {/* Right: quick actions */}
            <div className="flex items-center gap-3">
                <button className="relative p-2 text-charcoal/40 hover:text-charcoal transition-colors cursor-pointer">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-clay rounded-full" />
                </button>
                <div className="w-9 h-9 rounded-full bg-sage/50 flex items-center justify-center text-moss">
                    <User size={16} />
                </div>
            </div>
        </header>
    );
};
