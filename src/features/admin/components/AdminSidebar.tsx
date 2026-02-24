import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Package,
    Store,
    CalendarCheck,
    Dumbbell,
    ArrowLeft,
} from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} />, end: true },
    { label: 'Blog Posts', path: '/admin/blog', icon: <FileText size={18} /> },
    { label: 'Products', path: '/admin/products', icon: <Package size={18} /> },
    { label: 'Store Settings', path: '/admin/store', icon: <Store size={18} /> },
    { label: 'Consultations', path: '/admin/consultations', icon: <CalendarCheck size={18} /> },
    { label: 'Programs', path: '/admin/programs', icon: <Dumbbell size={18} /> },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-charcoal z-50 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Brand */}
                <div className="px-6 pt-8 pb-6 border-b border-white/5">
                    <h1 className="font-serif italic text-xl text-white tracking-wide">Serum & Sculpt</h1>
                    <p className="text-[10px] font-sans text-white/30 uppercase tracking-[0.25em] mt-1 font-bold">Admin Portal</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-all duration-200 ${isActive
                                    ? 'bg-moss text-white font-semibold shadow-md shadow-moss/20'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Back to site */}
                <div className="px-3 pb-6">
                    <NavLink
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans text-white/30 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                        <ArrowLeft size={18} />
                        Back to Site
                    </NavLink>
                </div>
            </aside>
        </>
    );
};
