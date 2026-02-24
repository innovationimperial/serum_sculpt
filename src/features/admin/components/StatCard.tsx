import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    change: number;
    icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, change, icon }) => {
    const isPositive = change >= 0;

    return (
        <div className="bg-white rounded-2xl p-6 border border-charcoal/5 hover:shadow-lg transition-shadow duration-300 group cursor-default">
            <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-sage/40 flex items-center justify-center text-moss group-hover:bg-moss group-hover:text-white transition-colors duration-300">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-sans font-semibold px-2 py-1 rounded-full ${isPositive
                        ? 'text-moss bg-sage/50'
                        : 'text-red-600 bg-red-50'
                    }`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isPositive ? '+' : ''}{change}%
                </div>
            </div>

            <p className="font-serif italic text-3xl text-charcoal mb-1">{value}</p>
            <p className="text-xs font-sans text-charcoal/50 uppercase tracking-widest font-bold">{label}</p>
        </div>
    );
};
