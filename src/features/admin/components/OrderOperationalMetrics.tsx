import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { StatCard } from './StatCard';
import { RotateCcw, XCircle, AlertTriangle, ShoppingCart } from 'lucide-react';

export const OrderOperationalMetrics: React.FC = () => {
    const metrics = useQuery(api.orders.getRevenueMetrics, {});

    if (!metrics) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading operational data...</div>
            </div>
        );
    }

    const rateCards = [
        {
            label: 'Refund Rate',
            value: `${metrics.refundRate.toFixed(1)}%`,
            detail: `${metrics.refundedCount} refunded out of ${metrics.totalOrders} orders`,
            icon: <RotateCcw size={18} />,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            barColor: 'bg-purple-400',
            pct: metrics.refundRate,
        },
        {
            label: 'Cancel Rate',
            value: `${metrics.cancelRate.toFixed(1)}%`,
            detail: `${metrics.cancelledCount} cancelled out of ${metrics.totalOrders} orders`,
            icon: <XCircle size={18} />,
            color: 'text-red-500',
            bg: 'bg-red-50',
            barColor: 'bg-red-400',
            pct: metrics.cancelRate,
        },
        {
            label: 'Payment Failure Rate',
            value: `${metrics.paymentFailureRate.toFixed(1)}%`,
            detail: `${metrics.failedPayments} failed payments out of ${metrics.totalOrders} orders`,
            icon: <AlertTriangle size={18} />,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            barColor: 'bg-amber-400',
            pct: metrics.paymentFailureRate,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stat cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard label="Total Orders" value={String(metrics.totalOrders)} icon={<ShoppingCart size={18} />} change={0} />
                <StatCard label="Refund Rate" value={`${metrics.refundRate.toFixed(1)}%`} icon={<RotateCcw size={18} />} change={0} />
                <StatCard label="Cancel Rate" value={`${metrics.cancelRate.toFixed(1)}%`} icon={<XCircle size={18} />} change={0} />
                <StatCard label="Payment Failures" value={`${metrics.paymentFailureRate.toFixed(1)}%`} icon={<AlertTriangle size={18} />} change={0} />
            </div>

            {/* Rate detail cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rateCards.map(card => (
                    <div key={card.label} className="bg-white rounded-2xl border border-charcoal/5 p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                                {card.icon}
                            </div>
                            <span className="font-serif italic text-3xl text-charcoal">{card.value}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3">
                            <div className="w-full bg-charcoal/5 rounded-full h-2.5">
                                <div
                                    className={`${card.barColor} h-2.5 rounded-full transition-all duration-500`}
                                    style={{ width: `${Math.min(card.pct, 100)}%` }}
                                />
                            </div>
                        </div>

                        <p className="text-xs font-sans text-charcoal/50 uppercase tracking-widest font-bold mb-2">{card.label}</p>
                        <p className="text-xs font-sans text-charcoal/40 leading-relaxed">{card.detail}</p>
                    </div>
                ))}
            </div>

            {/* Operational summary */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
                <h3 className="font-serif italic text-lg text-charcoal mb-4">Operational Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="font-serif italic text-3xl text-charcoal">{metrics.totalOrders}</p>
                        <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-bold mt-1">Total Orders</p>
                    </div>
                    <div className="text-center">
                        <p className="font-serif italic text-3xl text-purple-500">{metrics.refundedCount}</p>
                        <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-bold mt-1">Refunded</p>
                    </div>
                    <div className="text-center">
                        <p className="font-serif italic text-3xl text-red-400">{metrics.cancelledCount}</p>
                        <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-bold mt-1">Cancelled</p>
                    </div>
                    <div className="text-center">
                        <p className="font-serif italic text-3xl text-amber-500">{metrics.failedPayments}</p>
                        <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-bold mt-1">Failed Payments</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
