import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { StatCard } from './StatCard';
import { DollarSign, TrendingUp, Percent, Package, Truck } from 'lucide-react';

export const OrderRevenueMetrics: React.FC = () => {
    const metrics = useQuery(api.orders.getRevenueMetrics, {});
    const orders = useQuery(api.orders.list, {});

    if (!metrics || !orders) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading revenue data...</div>
            </div>
        );
    }

    // Monthly revenue for bar chart (last 12 months)
    const now = new Date();
    const monthlyRevenue: number[] = Array(12).fill(0);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (const order of orders) {
        if (order.status === 'cancelled' || order.status === 'refunded') continue;
        const d = new Date(order._creationTime);
        const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
        if (monthsAgo >= 0 && monthsAgo < 12) {
            monthlyRevenue[11 - monthsAgo] += order.total;
        }
    }

    const maxRevenue = Math.max(...monthlyRevenue, 1);

    // Derive current month labels
    const monthLabels = Array(12).fill('').map((_, i) => {
        const m = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
        return months[m.getMonth()];
    });

    return (
        <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                <StatCard
                    label="Gross Revenue"
                    value={`R${metrics.grossRevenue.toLocaleString()}`}
                    icon={<DollarSign size={18} />}
                    change={0}
                />
                <StatCard
                    label="Net Revenue"
                    value={`R${metrics.netRevenue.toLocaleString()}`}
                    icon={<TrendingUp size={18} />}
                    change={0}
                />
                <StatCard
                    label="Discounts Given"
                    value={`R${metrics.totalDiscounts.toLocaleString()}`}
                    icon={<Percent size={18} />}
                    change={0}
                />
                <StatCard
                    label="Tax Collected"
                    value={`R${metrics.totalTax.toLocaleString()}`}
                    icon={<Package size={18} />}
                    change={0}
                />
                <StatCard
                    label="Shipping Revenue"
                    value={`R${metrics.totalShipping.toLocaleString()}`}
                    icon={<Truck size={18} />}
                    change={0}
                />
            </div>

            {/* Revenue bar chart */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-serif italic text-lg text-charcoal">Monthly Revenue Trend</h3>
                        <p className="text-xs font-sans text-charcoal/40 mt-1">Last 12 months (ZAR)</p>
                    </div>
                </div>
                <div className="flex items-end gap-2 h-48">
                    {monthlyRevenue.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className="w-full bg-sage/60 rounded-t-lg hover:bg-moss/60 transition-colors duration-200 cursor-default min-h-[4px]"
                                style={{ height: `${(val / maxRevenue) * 100}%` }}
                                title={`R${val.toLocaleString()}`}
                            />
                            <span className="text-[9px] font-sans text-charcoal/30 font-bold">{monthLabels[i]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Revenue breakdown cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
                    <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-4">Revenue Breakdown</h4>
                    <div className="space-y-3">
                        {[
                            { label: 'Gross Revenue', value: metrics.grossRevenue, color: 'bg-moss' },
                            { label: 'Net Revenue', value: metrics.netRevenue, color: 'bg-emerald-500' },
                            { label: 'Tax Collected', value: metrics.totalTax, color: 'bg-blue-500' },
                            { label: 'Shipping', value: metrics.totalShipping, color: 'bg-amber-500' },
                            { label: 'Discounts', value: metrics.totalDiscounts, color: 'bg-red-400' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                                    <span className="text-sm font-sans text-charcoal/70">{item.label}</span>
                                </div>
                                <span className="text-sm font-sans font-semibold text-charcoal">
                                    R{item.value.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
                    <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-4">Key Ratios</h4>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-sans text-charcoal/70">Discount Impact</span>
                                <span className="text-sm font-sans font-semibold text-charcoal">
                                    {metrics.grossRevenue > 0 ? ((metrics.totalDiscounts / metrics.grossRevenue) * 100).toFixed(1) : '0'}%
                                </span>
                            </div>
                            <div className="w-full bg-charcoal/5 rounded-full h-2">
                                <div
                                    className="bg-red-400 h-2 rounded-full transition-all"
                                    style={{ width: `${metrics.grossRevenue > 0 ? Math.min((metrics.totalDiscounts / metrics.grossRevenue) * 100, 100) : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-sans text-charcoal/70">Tax Rate</span>
                                <span className="text-sm font-sans font-semibold text-charcoal">
                                    {metrics.grossRevenue > 0 ? ((metrics.totalTax / metrics.grossRevenue) * 100).toFixed(1) : '0'}%
                                </span>
                            </div>
                            <div className="w-full bg-charcoal/5 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${metrics.grossRevenue > 0 ? Math.min((metrics.totalTax / metrics.grossRevenue) * 100, 100) : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-sans text-charcoal/70">Net Margin</span>
                                <span className="text-sm font-sans font-semibold text-charcoal">
                                    {metrics.grossRevenue > 0 ? ((metrics.netRevenue / metrics.grossRevenue) * 100).toFixed(1) : '0'}%
                                </span>
                            </div>
                            <div className="w-full bg-charcoal/5 rounded-full h-2">
                                <div
                                    className="bg-moss h-2 rounded-full transition-all"
                                    style={{ width: `${metrics.grossRevenue > 0 ? Math.min((metrics.netRevenue / metrics.grossRevenue) * 100, 100) : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
