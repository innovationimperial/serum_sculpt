import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { DataTable } from './DataTable';
import { StatCard } from './StatCard';
import { Users, DollarSign, ShoppingCart, X, Mail, MapPin, Globe, Tag, Calendar, Clock } from 'lucide-react';

export const OrderCustomerIntelligence: React.FC = () => {
    const customers = useQuery(api.orders.getCustomerStats, {});
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (!customers) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading customer data...</div>
            </div>
        );
    }

    const selected = selectedId ? customers.find(c => c.userId === selectedId) : null;
    const totalCustomers = customers.length;
    const totalLTV = customers.reduce((sum, c) => sum + c.ltv, 0);
    const avgAOV = totalCustomers > 0 ? totalLTV / customers.reduce((s, c) => s + c.totalOrders, 0) : 0;

    const columns = [
        {
            key: 'userId' as const,
            label: 'Customer ID',
            width: '130px',
            render: (_: unknown, row: typeof customers[0]) => (
                <span className="font-mono text-[10px] text-charcoal/50">{row.userId.slice(0, 12)}…</span>
            ),
        },
        {
            key: 'name' as const,
            label: 'Name',
            sortable: true,
            render: (_: unknown, row: typeof customers[0]) => (
                <div>
                    <p className="font-semibold text-charcoal">{row.name}</p>
                    <p className="text-[10px] text-charcoal/40">{row.email}</p>
                </div>
            ),
        },
        {
            key: 'customerType' as const,
            label: 'Type',
            width: '110px',
            render: (_: unknown, row: typeof customers[0]) => {
                const colors: Record<string, string> = {
                    guest: 'bg-charcoal/5 text-charcoal/50',
                    registered: 'bg-moss/10 text-moss',
                    wholesale: 'bg-blue-50 text-blue-600',
                    vip: 'bg-amber-50 text-amber-600',
                };
                return (
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[row.customerType] || colors.registered}`}>
                        {row.customerType}
                    </span>
                );
            },
        },
        {
            key: 'totalOrders' as const,
            label: 'Orders',
            sortable: true,
            width: '80px',
            render: (_: unknown, row: typeof customers[0]) => (
                <span className="font-serif italic text-lg text-charcoal">{row.totalOrders}</span>
            ),
        },
        {
            key: 'ltv' as const,
            label: 'LTV',
            sortable: true,
            width: '120px',
            render: (_: unknown, row: typeof customers[0]) => (
                <span className="font-sans font-semibold text-sm text-moss">R{row.ltv.toLocaleString()}</span>
            ),
        },
        {
            key: 'aov' as const,
            label: 'AOV',
            width: '100px',
            render: (_: unknown, row: typeof customers[0]) => (
                <span className="text-sm text-charcoal/60">R{row.aov.toFixed(0)}</span>
            ),
        },
        {
            key: 'lastOrderDate' as const,
            label: 'Last Order',
            width: '120px',
            render: (_: unknown, row: typeof customers[0]) => (
                <span className="text-xs text-charcoal/50">
                    {row.lastOrderDate > 0 ? new Date(row.lastOrderDate).toLocaleDateString() : '—'}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Total Customers" value={String(totalCustomers)} icon={<Users size={18} />} change={0} />
                <StatCard label="Total Lifetime Value" value={`R${totalLTV.toLocaleString()}`} icon={<DollarSign size={18} />} change={0} />
                <StatCard label="Average Order Value" value={`R${avgAOV.toFixed(0)}`} icon={<ShoppingCart size={18} />} change={0} />
            </div>

            {/* Table */}
            <DataTable
                columns={columns as any}
                data={customers.map(c => ({ ...c, id: c.userId })) as any}
                onRowClick={(row: any) => setSelectedId(row.userId)}
                emptyMessage="No customer data available."
            />

            {/* Detail slide-over */}
            {selected && (
                <>
                    <div className="fixed inset-0 z-[80] bg-charcoal/30 backdrop-blur-sm" onClick={() => setSelectedId(null)} />
                    <div className="fixed top-0 right-0 z-[85] h-full w-full max-w-lg bg-white shadow-2xl animate-[slideIn_0.3s_ease-out] overflow-y-auto">
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-charcoal/5 p-6 flex items-start justify-between z-10">
                            <div>
                                <h2 className="font-serif italic text-2xl text-charcoal mb-1">{selected.name}</h2>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-moss/10 text-moss">
                                    {selected.customerType}
                                </span>
                            </div>
                            <button onClick={() => setSelectedId(null)} className="p-1 text-charcoal/30 hover:text-charcoal transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-stone rounded-xl p-5 space-y-3">
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <Tag size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">ID: <span className="font-mono text-[11px]">{selected.userId}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <Mail size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">{selected.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <Clock size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">Phone: {selected.phone || '—'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <MapPin size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">Billing: {selected.billingAddress || '—'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <MapPin size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">Shipping: {selected.shippingAddress || '—'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <Globe size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">{selected.country}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <Calendar size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">Account Created: {new Date(selected.accountCreatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-moss/5 rounded-xl p-4 text-center">
                                    <p className="font-serif italic text-2xl text-moss">{selected.totalOrders}</p>
                                    <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-bold mt-1">Orders</p>
                                </div>
                                <div className="bg-moss/5 rounded-xl p-4 text-center">
                                    <p className="font-serif italic text-2xl text-moss">R{selected.ltv.toLocaleString()}</p>
                                    <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-bold mt-1">LTV</p>
                                </div>
                                <div className="bg-moss/5 rounded-xl p-4 text-center">
                                    <p className="font-serif italic text-2xl text-moss">R{selected.aov.toFixed(0)}</p>
                                    <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-bold mt-1">AOV</p>
                                </div>
                            </div>

                            <div className="text-xs text-charcoal/40 font-sans">
                                Last order: {selected.lastOrderDate > 0 ? new Date(selected.lastOrderDate).toLocaleDateString() : 'No orders yet'}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};
