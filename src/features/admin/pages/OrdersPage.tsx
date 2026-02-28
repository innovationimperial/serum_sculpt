import React, { useState } from 'react';
import { Users, ClipboardList, TrendingUp, Activity } from 'lucide-react';
import { OrderCustomerIntelligence } from '../components/OrderCustomerIntelligence';
import { OrderIntelligence } from '../components/OrderIntelligence';
import { OrderRevenueMetrics } from '../components/OrderRevenueMetrics';
import { OrderOperationalMetrics } from '../components/OrderOperationalMetrics';

const TABS = [
    { id: 'customers', label: 'Customer Intelligence', icon: <Users size={16} /> },
    { id: 'orders', label: 'Order Intelligence', icon: <ClipboardList size={16} /> },
    { id: 'revenue', label: 'Revenue & Performance', icon: <TrendingUp size={16} /> },
    { id: 'operations', label: 'Operational Metrics', icon: <Activity size={16} /> },
] as const;

type TabId = typeof TABS[number]['id'];

const OrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('orders');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif italic text-moss">Order Management</h1>
                <p className="text-sm font-sans text-charcoal/60 mt-1">
                    Full order lifecycle, customer insights, and revenue analytics.
                </p>
            </div>

            {/* Tab navigation */}
            <div className="flex flex-wrap gap-2">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all duration-200 cursor-pointer ${activeTab === tab.id
                                ? 'bg-moss text-white shadow-md shadow-moss/20'
                                : 'bg-charcoal/5 text-charcoal/40 hover:text-charcoal hover:bg-charcoal/10'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div>
                {activeTab === 'customers' && <OrderCustomerIntelligence />}
                {activeTab === 'orders' && <OrderIntelligence />}
                {activeTab === 'revenue' && <OrderRevenueMetrics />}
                {activeTab === 'operations' && <OrderOperationalMetrics />}
            </div>
        </div>
    );
};

export default OrdersPage;
