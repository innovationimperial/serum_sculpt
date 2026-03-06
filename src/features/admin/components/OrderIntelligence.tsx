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
    CreditCard, DollarSign, CheckCircle, XCircle, Truck, RotateCcw,
    Hash, ExternalLink
} from 'lucide-react';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
type PaymentStatus = 'paid' | 'failed' | 'refunded' | 'partially_refunded';

type OrderItem = {
    productId: Id<'products'>;
    productName: string;
    price: number;
    quantity: number;
    discount?: number;
};

type ShippingDetails = {
    fullName: string;
    email: string;
    address: string;
    city: string;
    province: string;
    zipCode: string;
};

type PaystackDetails = {
    transactionId?: number;
    domain?: string;
    amount?: number;
    requestedAmount?: number;
    channel?: string;
    message?: string;
    fees?: number;
    paidAt?: string;
    createdAt?: string;
    transactionDate?: string;
    gatewayResponse?: string;
    cardType?: string;
    cardLast4?: string;
    cardBank?: string;
    cardCountryCode?: string;
    cardBin?: string;
    cardBrand?: string;
    expMonth?: string;
    expYear?: string;
    signature?: string;
    reusable?: boolean;
    accountName?: string;
    authorization?: string;
    customerId?: number;
    customerCode?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerRiskAction?: string;
    customerInternationalPhone?: string;
    ipAddress?: string;
    logStartTime?: number;
    logTimeSpent?: number;
    logAttempts?: number;
    logErrors?: number;
    logSuccess?: boolean;
    logMobile?: boolean;
    history?: Array<{
        type: string;
        message: string;
        time: number;
    }>;
};

type OrderRecord = {
    _id: Id<'orders'>;
    _creationTime: number;
    items: OrderItem[];
    shippingDetails: ShippingDetails;
    total: number;
    status: OrderStatus;
    customerName: string;
    customerEmail: string;
    paymentMethod?: string;
    paymentStatus?: PaymentStatus;
    discountCode?: string;
    discountAmount?: number;
    shippingCost?: number;
    tax?: number;
    currency?: string;
    paymentReference?: string;
    paystackDetails?: PaystackDetails;
};

type OrderTableRow = OrderRecord & { id: string };

type DataTableColumn<T> = {
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
};

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
    const ordersResult = useQuery(api.orders.listWithUsers, {});
    const updateStatus = useMutation(api.orders.updateStatus);
    const { toast } = useToast();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [confirmStatus, setConfirmStatus] = useState<OrderStatus | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');

    if (!ordersResult) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading orders...</div>
            </div>
        );
    }

    const orders = ordersResult as OrderRecord[];
    const selected = selectedId ? orders.find((o: OrderRecord) => o._id === selectedId) : null;
    const filtered = statusFilter === 'all' ? orders : orders.filter((o: OrderRecord) => o.status === statusFilter);

    const pendingCount = orders.filter((o: OrderRecord) => o.status === 'pending').length;
    const shippedCount = orders.filter((o: OrderRecord) => o.status === 'shipped').length;
    const deliveredCount = orders.filter((o: OrderRecord) => o.status === 'delivered').length;

    const handleStatusChange = async () => {
        if (!confirmStatus || !selected) return;
        await updateStatus({ id: selected._id as Id<'orders'>, status: confirmStatus });
        setConfirmStatus(null);
        toast('success', `Order marked as ${confirmStatus}`);
    };

    const columns: DataTableColumn<OrderTableRow>[] = [
        {
            key: '_id',
            label: 'Order ID',
            width: '130px',
            render: (_value, row) => (
                <span className="font-mono text-[10px] text-charcoal/50">{row._id.slice(0, 12)}...</span>
            ),
        },
        {
            key: 'customerName',
            label: 'Customer',
            sortable: true,
            render: (_value, row) => (
                <div>
                    <p className="font-semibold text-charcoal text-sm">{row.customerName}</p>
                    <p className="text-[10px] text-charcoal/40">{row.customerEmail}</p>
                </div>
            ),
        },
        {
            key: '_creationTime',
            label: 'Date',
            sortable: true,
            width: '140px',
            render: (_value, row) => (
                <div>
                    <p className="text-sm text-charcoal/70">{new Date(row._creationTime).toLocaleDateString()}</p>
                    <p className="text-[10px] text-charcoal/40">{new Date(row._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            ),
        },
        {
            key: 'total',
            label: 'Total',
            sortable: true,
            width: '110px',
            render: (_value, row) => (
                <span className="font-sans font-semibold text-sm text-charcoal">R{row.total.toLocaleString()}</span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            width: '120px',
            render: (value) => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[String(value)] || ''}`}>
                    {String(value)}
                </span>
            ),
        },
        {
            key: 'paymentReference',
            label: 'Paystack Ref',
            width: '150px',
            render: (_value, row) => {
                const ref = row.paymentReference;
                return ref ? (
                    <span className="font-mono text-[10px] text-charcoal/50" title={ref}>{ref.slice(0, 18)}...</span>
                ) : (
                    <span className="text-charcoal/20 text-[10px]">-</span>
                );
            },
        },
        {
            key: 'items',
            label: 'Items',
            width: '60px',
            render: (_value, row) => (
                <span className="text-charcoal/50 text-xs">{row.items.length}</span>
            ),
        },
    ];

    const filterTabs = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard label="Total Orders" value={String(orders.length)} icon={<ShoppingCart size={18} />} change={0} />
                <StatCard label="Pending" value={String(pendingCount)} icon={<Clock size={18} />} change={0} />
                <StatCard label="Shipped" value={String(shippedCount)} icon={<Truck size={18} />} change={0} />
                <StatCard label="Delivered" value={String(deliveredCount)} icon={<Package size={18} />} change={0} />
            </div>

            <div className="flex flex-wrap gap-2">
                {filterTabs.map((tab) => (
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

            <DataTable
                columns={columns}
                data={filtered.map((o: OrderRecord) => ({ ...o, id: o._id }))}
                onRowClick={(row: OrderTableRow) => setSelectedId(row._id)}
                emptyMessage="No orders found."
            />

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
                            <div className="bg-stone rounded-xl p-5 space-y-3">
                                <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Customer</h4>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <Mail size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">{selected.customerName} - {selected.customerEmail}</span>
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

                            {(selected.paymentReference || selected.paystackDetails) && (() => {
                                const ps = selected.paystackDetails;
                                const ref = selected.paymentReference;

                                return (
                                    <div className="bg-stone rounded-xl p-5 space-y-3">
                                        <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2 flex items-center gap-2">
                                            <CreditCard size={12} /> Payment Details (Paystack)
                                        </h4>
                                        {ref && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Hash size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Reference</span>
                                                <span className="font-mono text-xs text-charcoal/80 bg-white px-2 py-1 rounded-lg border border-charcoal/5 select-all break-all">{ref}</span>
                                            </div>
                                        )}
                                        {ps?.transactionId != null && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Hash size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Transaction</span>
                                                <span className="font-mono text-xs text-charcoal/80">{ps.transactionId}</span>
                                                {ps.domain && <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-charcoal/5 text-charcoal/60 tracking-wider">{ps.domain}</span>}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-sm font-sans">
                                            <CheckCircle size={14} className="text-emerald-500" />
                                            <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Status</span>
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${selected.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                                                selected.paymentStatus === 'failed' ? 'bg-red-50 text-red-500' :
                                                    selected.paymentStatus === 'refunded' ? 'bg-purple-50 text-purple-500' :
                                                        'bg-charcoal/5 text-charcoal/40'
                                                }`}>{selected.paymentStatus ?? 'paid'}</span>
                                            {ps?.gatewayResponse && <span className="text-charcoal/50 text-xs">- {ps.gatewayResponse}</span>}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-sans">
                                            <DollarSign size={14} className="text-charcoal/30" />
                                            <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Amount</span>
                                            <span className="font-semibold text-charcoal">R{(ps?.amount ?? selected.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            <span className="text-[10px] text-charcoal/30 uppercase">{selected.currency ?? 'ZAR'}</span>
                                        </div>
                                        {ps?.requestedAmount != null && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <DollarSign size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Requested</span>
                                                <span className="text-charcoal/70">R{ps.requestedAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {ps?.fees != null && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <DollarSign size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Fees</span>
                                                <span className="text-charcoal/70">R{ps.fees.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {ps?.channel && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <CreditCard size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Channel</span>
                                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-charcoal/5 text-charcoal/60 tracking-wider">{ps.channel}</span>
                                            </div>
                                        )}
                                        {ps?.cardType && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <CreditCard size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Card</span>
                                                <span className="text-charcoal/70 capitalize">{ps.cardType}</span>
                                                {ps.cardBrand && <span className="text-[10px] uppercase tracking-wider text-charcoal/40">{ps.cardBrand}</span>}
                                                {ps.cardBin && ps.cardLast4 && <span className="font-mono text-xs text-charcoal/50">{ps.cardBin} **** {ps.cardLast4}</span>}
                                            </div>
                                        )}
                                        {(ps?.expMonth || ps?.expYear) && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <CreditCard size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Expiry</span>
                                                <span className="text-charcoal/70">{ps.expMonth ?? '--'}/{ps.expYear ?? '--'}</span>
                                                {ps.reusable != null && <span className="text-[10px] uppercase tracking-wider text-charcoal/40">{ps.reusable ? 'Reusable' : 'Single use'}</span>}
                                            </div>
                                        )}
                                        {ps?.cardBank && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <MapPin size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Bank</span>
                                                <span className="text-charcoal/70">{ps.cardBank} {ps.cardCountryCode ? `(${ps.cardCountryCode})` : ''}</span>
                                            </div>
                                        )}
                                        {ps?.authorization && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Hash size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Auth Code</span>
                                                <span className="font-mono text-xs text-charcoal/60">{ps.authorization}</span>
                                            </div>
                                        )}
                                        {ps?.signature && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Hash size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Signature</span>
                                                <span className="font-mono text-xs text-charcoal/60 break-all">{ps.signature}</span>
                                            </div>
                                        )}
                                        {ps?.customerEmail && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Mail size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Payer Email</span>
                                                <span className="text-charcoal/70">{ps.customerEmail}</span>
                                            </div>
                                        )}
                                        {(ps?.customerFirstName || ps?.customerLastName) && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Mail size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Customer</span>
                                                <span className="text-charcoal/70">{[ps.customerFirstName, ps.customerLastName].filter(Boolean).join(' ')}</span>
                                            </div>
                                        )}
                                        {ps?.customerPhone && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Mail size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Phone</span>
                                                <span className="text-charcoal/70">{ps.customerPhone}</span>
                                            </div>
                                        )}
                                        {(ps?.customerCode || ps?.customerId != null) && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Hash size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Customer ID</span>
                                                <span className="text-charcoal/70">{ps.customerCode ?? ps.customerId}</span>
                                                {ps.customerRiskAction && <span className="text-[10px] uppercase tracking-wider text-charcoal/40">{ps.customerRiskAction}</span>}
                                            </div>
                                        )}
                                        {ps?.ipAddress && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Hash size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">IP Address</span>
                                                <span className="font-mono text-xs text-charcoal/60">{ps.ipAddress}</span>
                                            </div>
                                        )}
                                        {ps?.paidAt && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Clock size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Paid At</span>
                                                <span className="text-charcoal/70">{new Date(ps.paidAt).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} {new Date(ps.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        )}
                                        {ps?.createdAt && (
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <Clock size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Created</span>
                                                <span className="text-charcoal/70">{new Date(ps.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })} {new Date(ps.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        )}
                                        {(ps?.logTimeSpent != null || ps?.logAttempts != null || ps?.logErrors != null || ps?.logMobile != null) && (
                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                {ps.logTimeSpent != null && (
                                                    <div className="rounded-xl bg-white px-4 py-3 border border-charcoal/5">
                                                        <p className="text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Time Spent</p>
                                                        <p className="text-lg font-serif italic text-charcoal">{ps.logTimeSpent} sec</p>
                                                    </div>
                                                )}
                                                {ps.logAttempts != null && (
                                                    <div className="rounded-xl bg-white px-4 py-3 border border-charcoal/5">
                                                        <p className="text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Attempts</p>
                                                        <p className="text-lg font-serif italic text-charcoal">{ps.logAttempts}</p>
                                                    </div>
                                                )}
                                                {ps.logErrors != null && (
                                                    <div className="rounded-xl bg-white px-4 py-3 border border-charcoal/5">
                                                        <p className="text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Errors</p>
                                                        <p className="text-lg font-serif italic text-charcoal">{ps.logErrors}</p>
                                                    </div>
                                                )}
                                                {ps.logMobile != null && (
                                                    <div className="rounded-xl bg-white px-4 py-3 border border-charcoal/5">
                                                        <p className="text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Device</p>
                                                        <p className="text-lg font-serif italic text-charcoal">{ps.logMobile ? 'Mobile' : 'Desktop'}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {ps?.history && ps.history.length > 0 && (
                                            <div className="pt-2">
                                                <h5 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3">Transaction Timeline</h5>
                                                <div className="space-y-2">
                                                    {ps.history.map((entry, index) => (
                                                        <div key={`${entry.type}-${entry.time}-${index}`} className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 border border-charcoal/5">
                                                            <span className={`mt-1 h-2 w-2 rounded-full ${entry.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                                            <div className="flex-1">
                                                                <p className="text-sm text-charcoal/80">{entry.message}</p>
                                                                <p className="text-[10px] uppercase tracking-wider text-charcoal/40">{entry.type} • {entry.time}s</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <a href="https://dashboard.paystack.com/#/transactions" target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-moss/10 text-moss text-xs font-sans font-semibold hover:bg-moss/20 transition-colors">
                                            <ExternalLink size={12} /> View on Paystack Dashboard
                                        </a>
                                    </div>
                                );
                            })()}

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
                                            {selected.items.map((item: OrderItem, i: number) => (
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

                            <div>
                                <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3 flex items-center gap-2">
                                    <DollarSign size={12} /> Pricing Breakdown
                                </h4>
                                <div className="bg-stone rounded-xl p-5 space-y-2">
                                    <div className="flex justify-between text-sm font-sans text-charcoal/60">
                                        <span>Subtotal</span>
                                        <span>R{selected.items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
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

                            {selected.status !== 'delivered' && selected.status !== 'cancelled' && selected.status !== 'refunded' && (
                                <div>
                                    <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3">Actions</h4>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {STATUS_ACTIONS
                                            .filter((action) => action.status !== selected.status)
                                            .map((action) => (
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
