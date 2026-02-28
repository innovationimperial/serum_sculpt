import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { DataTable } from './DataTable';
import { StatCard } from './StatCard';
import { useToast } from './Toast';
import { ConfirmDialog } from './ConfirmDialog';
import type { Id } from '../../../../convex/_generated/dataModel';
import {
    ShoppingCart, Clock, Package, X, Mail, MapPin,
    Tag, CreditCard, DollarSign, CheckCircle, XCircle, Truck, AlertCircle, RotateCcw
} from 'lucide-react';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-600',
    confirmed: 'bg-moss/10 text-moss',
    shipped: 'bg-blue-50 text-blue-600',
    delivered: 'bg-emerald-50 text-emerald-600',
    cancelled: 'bg-red-50 text-red-400',
    refunded: 'bg-purple-50 text-purple-500',
};

const STATUS_ACTIONS: { status: OrderStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { status: 'confirmed', label: 'Confirm', icon: <CheckCircle size={14} />, color: 'text-moss hover:bg-moss/10' },
    { status: 'shipped', label: 'Ship', icon: <Truck size={14} />, color: 'text-blue-600 hover:bg-blue-50' },
    { status: 'delivered', label: 'Delivered', icon: <Package size={14} />, color: 'text-emerald-600 hover:bg-emerald-50' },
    { status: 'cancelled', label: 'Cancel', icon: <XCircle size={14} />, color: 'text-red-500 hover:bg-red-50' },
    { status: 'refunded', label: 'Refund', icon: <RotateCcw size={14} />, color: 'text-purple-500 hover:bg-purple-50' },
];

export const OrderIntelligence: React.FC = () => {
    const orders = useQuery(api.orders.listWithUsers, {});
    const updateStatus = useMutation(api.orders.updateStatus);
    const { toast } = useToast();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [confirmStatus, setConfirmStatus] = useState<OrderStatus | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');

    if (!orders) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading orders...</div>
            </div>
        );
    }

    const selected = selectedId ? orders.find(o => o._id === selectedId) : null;
    const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const shippedCount = orders.filter(o => o.status === 'shipped').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;

    const handleStatusChange = async () => {
        if (!confirmStatus || !selected) return;
        await updateStatus({ id: selected._id as Id<"orders">, status: confirmStatus });
        setConfirmStatus(null);
        toast('success', `Order marked as ${confirmStatus}`);
    };

    const columns = [
        {
            key: '_id' as const,
            label: 'Order ID',
            width: '130px',
            render: (_: unknown, row: typeof orders[0]) => (
                <span className="font-mono text-[10px] text-charcoal/50">{(row._id as string).slice(0, 12)}…</span>
            ),
        },
        {
            key: 'customerName' as const,
            label: 'Customer',
            sortable: true,
            render: (_: unknown, row: typeof orders[0]) => (
                <div>
                    <p className="font-semibold text-charcoal text-sm">{row.customerName}</p>
                    <p className="text-[10px] text-charcoal/40">{row.customerEmail}</p>
                </div>
            ),
        },
        {
            key: '_creationTime' as const,
            label: 'Date',
            sortable: true,
            width: '140px',
            render: (_: unknown, row: typeof orders[0]) => (
                <div>
                    <p className="text-sm text-charcoal/70">{new Date(row._creationTime).toLocaleDateString()}</p>
                    <p className="text-[10px] text-charcoal/40">{new Date(row._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            ),
        },
        {
            key: 'total' as const,
            label: 'Total',
            sortable: true,
            width: '110px',
            render: (_: unknown, row: typeof orders[0]) => (
                <span className="font-sans font-semibold text-sm text-charcoal">R{row.total.toLocaleString()}</span>
            ),
        },
        {
            key: 'status' as const,
            label: 'Status',
            sortable: true,
            width: '120px',
            render: (val: unknown) => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[String(val)] || ''}`}>
                    {String(val)}
                </span>
            ),
        },
        {
            key: 'items' as const,
            label: 'Items',
            width: '60px',
            render: (_: unknown, row: typeof orders[0]) => (
                <span className="text-charcoal/50 text-xs">{row.items.length}</span>
            ),
        },
    ];

    const filterTabs = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'];

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard label="Total Orders" value={String(orders.length)} icon={<ShoppingCart size={18} />} change={0} />
                <StatCard label="Pending" value={String(pendingCount)} icon={<Clock size={18} />} change={0} />
                <StatCard label="Shipped" value={String(shippedCount)} icon={<Truck size={18} />} change={0} />
                <StatCard label="Delivered" value={String(deliveredCount)} icon={<Package size={18} />} change={0} />
            </div>

            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2">
                {filterTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-colors cursor-pointer capitalize ${statusFilter === tab ? 'bg-moss text-white' : 'bg-charcoal/5 text-charcoal/40 hover:text-charcoal'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Table */}
            <DataTable
                columns={columns as any}
                data={filtered.map(o => ({ ...o, id: o._id })) as any}
                onRowClick={(row: any) => setSelectedId(row._id)}
                emptyMessage="No orders found."
            />

            {/* Detail panel */}
            {selected && (
                <>
                    <div className="fixed inset-0 z-[80] bg-charcoal/30 backdrop-blur-sm" onClick={() => setSelectedId(null)} />
                    <div className="fixed top-0 right-0 z-[85] h-full w-full max-w-xl bg-white shadow-2xl animate-[slideIn_0.3s_ease-out] overflow-y-auto">
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-charcoal/5 p-6 flex items-start justify-between z-10">
                            <div>
                                <h2 className="font-serif italic text-2xl text-charcoal mb-1">Order Detail</h2>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] text-charcoal/40">{selected._id}</span>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[selected.status]}`}>
                                        {selected.status}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedId(null)} className="p-1 text-charcoal/30 hover:text-charcoal transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer info */}
                            <div className="bg-stone rounded-xl p-5 space-y-3">
                                <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Customer</h4>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <Mail size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">{selected.customerName} — {selected.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <MapPin size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">{selected.shippingDetails.address}, {selected.shippingDetails.city}, {selected.shippingDetails.province} {selected.shippingDetails.zipCode}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <CreditCard size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">Payment: {selected.paymentMethod ?? 'Card'}</span>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${selected.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                                            selected.paymentStatus === 'failed' ? 'bg-red-50 text-red-500' :
                                                'bg-charcoal/5 text-charcoal/40'
                                        }`}>{selected.paymentStatus ?? 'paid'}</span>
                                </div>
                            </div>

                            {/* Product breakdown */}
                            <div>
                                <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3 flex items-center gap-2">
                                    <Package size={12} /> Product Breakdown
                                </h4>
                                <div className="bg-white border border-charcoal/5 rounded-xl overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-charcoal/5">
                                                <th className="text-left px-4 py-3 text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Product</th>
                                                <th className="text-center px-3 py-3 text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Qty</th>
                                                <th className="text-right px-3 py-3 text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Unit Price</th>
                                                <th className="text-right px-3 py-3 text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Discount</th>
                                                <th className="text-right px-4 py-3 text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selected.items.map((item, i) => (
                                                <tr key={i} className="border-b border-charcoal/[0.03] last:border-0">
                                                    <td className="px-4 py-3 text-sm font-sans text-charcoal/80">{item.productName}</td>
                                                    <td className="px-3 py-3 text-sm font-sans text-charcoal/60 text-center">{item.quantity}</td>
                                                    <td className="px-3 py-3 text-sm font-sans text-charcoal/60 text-right">R{item.price.toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-sm font-sans text-charcoal/60 text-right">R{(item.discount ?? 0).toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-sm font-sans font-semibold text-charcoal text-right">R{((item.price * item.quantity) - (item.discount ?? 0)).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pricing breakdown */}
                            <div>
                                <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3 flex items-center gap-2">
                                    <DollarSign size={12} /> Pricing Breakdown
                                </h4>
                                <div className="bg-stone rounded-xl p-5 space-y-2">
                                    <div className="flex justify-between text-sm font-sans text-charcoal/60">
                                        <span>Subtotal</span>
                                        <span>R{selected.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                                    </div>
                                    {(selected.discountAmount ?? 0) > 0 && (
                                        <div className="flex justify-between text-sm font-sans text-red-500">
                                            <span>Discount {selected.discountCode ? `(${selected.discountCode})` : ''}</span>
                                            <span>-R{(selected.discountAmount ?? 0).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm font-sans text-charcoal/60">
                                        <span>Shipping</span>
                                        <span>R{(selected.shippingCost ?? 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-sans text-charcoal/60">
                                        <span>Tax (VAT)</span>
                                        <span>R{(selected.tax ?? 0).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-charcoal/10 pt-2 flex justify-between">
                                        <span className="font-serif italic text-lg text-charcoal">Total</span>
                                        <span className="font-serif italic text-lg text-charcoal">R{selected.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-sans text-charcoal/30 uppercase tracking-wider">
                                        <span>Currency</span>
                                        <span>{selected.currency ?? 'ZAR'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status actions */}
                            {selected.status !== 'delivered' && selected.status !== 'cancelled' && selected.status !== 'refunded' && (
                                <div>
                                    <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3">Actions</h4>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {STATUS_ACTIONS
                                            .filter(a => a.status !== selected.status)
                                            .map(action => (
                                                <button
                                                    key={action.status}
                                                    onClick={() => setConfirmStatus(action.status)}
                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-charcoal/10 text-sm font-sans font-medium transition-all cursor-pointer ${action.color}`}
                                                >
                                                    {action.icon} {action.label}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Status confirmation dialog */}
            <ConfirmDialog
                isOpen={!!confirmStatus}
                title={`Mark as ${confirmStatus}`}
                message={`Are you sure you want to mark this order as "${confirmStatus}"?`}
                confirmLabel={`Yes, mark as ${confirmStatus}`}
                variant={confirmStatus === 'cancelled' || confirmStatus === 'refunded' ? 'danger' : 'default'}
                onConfirm={handleStatusChange}
                onCancel={() => setConfirmStatus(null)}
            />

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};
