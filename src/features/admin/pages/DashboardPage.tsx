import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, CalendarCheck, Eye, ShoppingCart, FileText, Package, CalendarPlus, Activity } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DASHBOARD_STATS, RECENT_ACTIVITY, REVENUE_TREND } from '../data/mockData';

const DashboardPage: React.FC = () => {
    const stats = DASHBOARD_STATS;
    const maxRevenue = Math.max(...REVENUE_TREND);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const activityIcons: Record<string, React.ReactNode> = {
        order: <ShoppingCart size={14} />,
        blog: <FileText size={14} />,
        booking: <CalendarCheck size={14} />,
        program: <Activity size={14} />,
    };

    const activityColors: Record<string, string> = {
        order: 'bg-clay/10 text-clay',
        blog: 'bg-moss/10 text-moss',
        booking: 'bg-blue-50 text-blue-600',
        program: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    label="Total Revenue"
                    value={`R${stats.totalRevenue.toLocaleString()}`}
                    change={stats.revenueChange}
                    icon={<DollarSign size={20} />}
                />
                <StatCard
                    label="Active Consultations"
                    value={String(stats.activeConsultations)}
                    change={stats.consultationsChange}
                    icon={<CalendarCheck size={20} />}
                />
                <StatCard
                    label="Blog Views"
                    value={stats.blogViews.toLocaleString()}
                    change={stats.blogViewsChange}
                    icon={<Eye size={20} />}
                />
                <StatCard
                    label="Product Orders"
                    value={String(stats.productOrders)}
                    change={stats.ordersChange}
                    icon={<ShoppingCart size={20} />}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Revenue chart — simple SVG bar chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-charcoal/5 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-serif italic text-lg text-charcoal">Revenue Trend</h3>
                            <p className="text-xs font-sans text-charcoal/40 mt-1">Monthly overview (ZAR)</p>
                        </div>
                    </div>

                    <div className="flex items-end gap-2 h-40">
                        {REVENUE_TREND.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-sage/60 rounded-t-lg hover:bg-moss/60 transition-colors duration-200 cursor-default min-h-[4px]"
                                    style={{ height: `${(val / maxRevenue) * 100}%` }}
                                    title={`R${val.toLocaleString()}`}
                                />
                                <span className="text-[9px] font-sans text-charcoal/30 font-bold">{months[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent activity */}
                <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
                    <h3 className="font-serif italic text-lg text-charcoal mb-5">Recent Activity</h3>
                    <div className="space-y-4">
                        {RECENT_ACTIVITY.map(item => (
                            <div key={item.id} className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activityColors[item.type]}`}>
                                    {activityIcons[item.type]}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-sans text-charcoal/80 leading-snug truncate">{item.message}</p>
                                    <p className="text-[10px] font-sans text-charcoal/30 mt-0.5">{item.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    to="/admin/blog/new"
                    className="flex items-center gap-3 bg-white rounded-2xl border border-charcoal/5 p-5 hover:border-moss/30 hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-xl bg-moss/10 flex items-center justify-center text-moss group-hover:bg-moss group-hover:text-white transition-colors duration-200">
                        <FileText size={18} />
                    </div>
                    <div>
                        <p className="font-sans text-sm font-semibold text-charcoal">New Blog Post</p>
                        <p className="text-xs font-sans text-charcoal/40">Create & publish content</p>
                    </div>
                </Link>

                <Link
                    to="/admin/products"
                    className="flex items-center gap-3 bg-white rounded-2xl border border-charcoal/5 p-5 hover:border-moss/30 hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-xl bg-clay/10 flex items-center justify-center text-clay group-hover:bg-clay group-hover:text-white transition-colors duration-200">
                        <Package size={18} />
                    </div>
                    <div>
                        <p className="font-sans text-sm font-semibold text-charcoal">Manage Products</p>
                        <p className="text-xs font-sans text-charcoal/40">Update catalogue & prices</p>
                    </div>
                </Link>

                <Link
                    to="/admin/consultations"
                    className="flex items-center gap-3 bg-white rounded-2xl border border-charcoal/5 p-5 hover:border-moss/30 hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                        <CalendarPlus size={18} />
                    </div>
                    <div>
                        <p className="font-sans text-sm font-semibold text-charcoal">View Bookings</p>
                        <p className="text-xs font-sans text-charcoal/40">Manage upcoming sessions</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default DashboardPage;
