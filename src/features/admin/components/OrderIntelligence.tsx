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
    Hash, ExternalLink, ShieldCheck
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
    gatewayResponse?: string;
    cardType?: string;
    cardLast4?: string;
    cardBank?: string;
    cardCountryCode?: string;
    cardBin?: string;
    cardBrand?: string;
    expMonth?: string;
    expYear?: string;
    reusable?: boolean;
    authorization?: string;
    customerId?: number;
    customerCode?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerRiskAction?: string;
    ipAddress?: string;
    history?: Array<{
        type: string;
        message: string;
        time: number;
    }>;
};

type PayPalDetails = {
    orderId?: string;
    captureId?: string;
    intent?: string;
    status?: string;
    payerId?: string;
    payerEmail?: string;
    payerGivenName?: string;
    payerSurname?: string;
    payerCountryCode?: string;
    captureStatus?: string;
    captureAmount?: number;
    captureCurrency?: string;
    grossAmount?: number;
    paypalFee?: number;
    netAmount?: number;
    sellerProtectionStatus?: string;
    sellerProtectionDisputeCategories?: string[];
    invoiceId?: string;
    customId?: string;
    merchantId?: string;
    merchantEmail?: string;
    createTime?: string;
    updateTime?: string;
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
    paymentAmount?: number;
    paymentCurrency?: string;
    exchangeRateUsed?: number;
    paymentReference?: string;
    payPalDetails?: PayPalDetails;
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

const PAYMENT_STATUS_COLORS: Record<string, string> = {
    paid: 'bg-emerald-50 text-emerald-600',
    failed: 'bg-red-50 text-red-500',
    refunded: 'bg-purple-50 text-purple-500',
    partially_refunded: 'bg-amber-50 text-amber-600',
};

const formatMoney = (amount: number, currency: string) => {
    try {
        return new Intl.NumberFormat('en', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${currency} ${amount.toFixed(2)}`;
    }
};

const formatDateTime = (value?: string | number) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return `${date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const PaymentStatusBadge: React.FC<{ status?: string }> = ({ status }) => (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${PAYMENT_STATUS_COLORS[status ?? ''] ?? 'bg-charcoal/5 text-charcoal/40'}`}>
        {status ?? 'unknown'}
    </span>
);

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
    const selected = selectedId ? orders.find((order) => order._id === selectedId) : null;
    const filtered = statusFilter === 'all' ? orders : orders.filter((order) => order.status === statusFilter);

    const pendingCount = orders.filter((order) => order.status === 'pending').length;
    const shippedCount = orders.filter((order) => order.status === 'shipped').length;
    const deliveredCount = orders.filter((order) => order.status === 'delivered').length;

    const handleStatusChange = async () => {
        if (!confirmStatus || !selected) return;
        await updateStatus({ id: selected._id, status: confirmStatus });
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
            label: 'Store Total',
            sortable: true,
            width: '130px',
            render: (_value, row) => (
                <span className="font-sans font-semibold text-sm text-charcoal">
                    {formatMoney(row.total, row.currency ?? 'ZAR')}
                </span>
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
            label: 'Payment Ref',
            width: '160px',
            render: (_value, row) => {
                const reference = row.paymentReference ?? row.payPalDetails?.captureId ?? row.paystackDetails?.transactionId?.toString();
                return reference ? (
                    <span className="font-mono text-[10px] text-charcoal/50" title={reference}>{reference.slice(0, 18)}...</span>
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
    const storeCurrency = selected?.currency ?? 'ZAR';
    const hasPayPalData = !!selected?.payPalDetails;
    const hasPaystackData = !!selected?.paystackDetails;

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
                        className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-colors cursor-pointer capitalize ${statusFilter === tab ? 'bg-moss text-white' : 'bg-charcoal/5 text-charcoal/40 hover:text-charcoal'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <DataTable
                columns={columns}
                data={filtered.map((order) => ({ ...order, id: order._id }))}
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
                                    <PaymentStatusBadge status={selected.paymentStatus} />
                                </div>
                            </div>

                            {(selected.paymentReference || hasPayPalData || hasPaystackData) && (
                                <div className="bg-stone rounded-xl p-5 space-y-3">
                                    <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2 flex items-center gap-2">
                                        <CreditCard size={12} /> Payment Details ({hasPayPalData ? 'PayPal' : 'Paystack'})
                                    </h4>

                                    {selected.paymentReference && (
                                        <div className="flex items-center gap-3 text-sm font-sans">
                                            <Hash size={14} className="text-charcoal/30" />
                                            <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Reference</span>
                                            <span className="font-mono text-xs text-charcoal/80 bg-white px-2 py-1 rounded-lg border border-charcoal/5 select-all break-all">{selected.paymentReference}</span>
                                        </div>
                                    )}

                                    {hasPayPalData && selected.payPalDetails && (
                                        <>
                                            {selected.payPalDetails.orderId && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <Hash size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Order ID</span>
                                                    <span className="font-mono text-xs text-charcoal/70 break-all">{selected.payPalDetails.orderId}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <CheckCircle size={14} className="text-emerald-500" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Status</span>
                                                <PaymentStatusBadge status={selected.payPalDetails.captureStatus ?? selected.paymentStatus} />
                                                {selected.payPalDetails.status && <span className="text-charcoal/50 text-xs">Order {selected.payPalDetails.status.toLowerCase()}</span>}
                                            </div>
                                            {selected.payPalDetails.captureAmount != null && selected.payPalDetails.captureCurrency && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <DollarSign size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Captured</span>
                                                    <span className="font-semibold text-charcoal">{formatMoney(selected.payPalDetails.captureAmount, selected.payPalDetails.captureCurrency)}</span>
                                                </div>
                                            )}
                                            {selected.paymentAmount != null && selected.paymentCurrency && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <DollarSign size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Recorded</span>
                                                    <span className="text-charcoal/70">{formatMoney(selected.paymentAmount, selected.paymentCurrency)}</span>
                                                </div>
                                            )}
                                            {(selected.payPalDetails.grossAmount != null || selected.payPalDetails.paypalFee != null || selected.payPalDetails.netAmount != null) && (
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                                    {selected.payPalDetails.grossAmount != null && selected.payPalDetails.captureCurrency && (
                                                        <div className="rounded-xl bg-white px-4 py-3 border border-charcoal/5">
                                                            <p className="text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Gross</p>
                                                            <p className="text-lg font-serif italic text-charcoal">{formatMoney(selected.payPalDetails.grossAmount, selected.payPalDetails.captureCurrency)}</p>
                                                        </div>
                                                    )}
                                                    {selected.payPalDetails.paypalFee != null && selected.payPalDetails.captureCurrency && (
                                                        <div className="rounded-xl bg-white px-4 py-3 border border-charcoal/5">
                                                            <p className="text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">PayPal Fee</p>
                                                            <p className="text-lg font-serif italic text-charcoal">{formatMoney(selected.payPalDetails.paypalFee, selected.payPalDetails.captureCurrency)}</p>
                                                        </div>
                                                    )}
                                                    {selected.payPalDetails.netAmount != null && selected.payPalDetails.captureCurrency && (
                                                        <div className="rounded-xl bg-white px-4 py-3 border border-charcoal/5">
                                                            <p className="text-[10px] font-sans uppercase tracking-wider font-bold text-charcoal/40">Net</p>
                                                            <p className="text-lg font-serif italic text-charcoal">{formatMoney(selected.payPalDetails.netAmount, selected.payPalDetails.captureCurrency)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {(selected.payPalDetails.payerEmail || selected.payPalDetails.payerGivenName || selected.payPalDetails.payerSurname) && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <Mail size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Payer</span>
                                                    <span className="text-charcoal/70">
                                                        {[selected.payPalDetails.payerGivenName, selected.payPalDetails.payerSurname].filter(Boolean).join(' ') || selected.payPalDetails.payerEmail}
                                                    </span>
                                                    {selected.payPalDetails.payerEmail && <span className="text-[10px] text-charcoal/40">{selected.payPalDetails.payerEmail}</span>}
                                                </div>
                                            )}
                                            {(selected.payPalDetails.sellerProtectionStatus || (selected.payPalDetails.sellerProtectionDisputeCategories?.length ?? 0) > 0) && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <ShieldCheck size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Protection</span>
                                                    <span className="text-charcoal/70">{selected.payPalDetails.sellerProtectionStatus ?? 'Unknown'}</span>
                                                    {(selected.payPalDetails.sellerProtectionDisputeCategories?.length ?? 0) > 0 && (
                                                        <span className="text-[10px] uppercase tracking-wider text-charcoal/40">{selected.payPalDetails.sellerProtectionDisputeCategories?.join(', ')}</span>
                                                    )}
                                                </div>
                                            )}
                                            {selected.exchangeRateUsed && selected.paymentCurrency && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <DollarSign size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">FX Rate</span>
                                                    <span className="text-charcoal/70">1 {storeCurrency} = {selected.exchangeRateUsed.toFixed(4)} {selected.paymentCurrency}</span>
                                                </div>
                                            )}
                                            {selected.payPalDetails.createTime && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <Clock size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Captured</span>
                                                    <span className="text-charcoal/70">{formatDateTime(selected.payPalDetails.createTime)}</span>
                                                </div>
                                            )}
                                            <a
                                                href="https://www.paypal.com/businessmanage/account/money"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-moss/10 text-moss text-xs font-sans font-semibold hover:bg-moss/20 transition-colors"
                                            >
                                                <ExternalLink size={12} /> View in PayPal Dashboard
                                            </a>
                                        </>
                                    )}

                                    {hasPaystackData && selected.paystackDetails && (
                                        <>
                                            {selected.paystackDetails.transactionId != null && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <Hash size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Transaction</span>
                                                    <span className="font-mono text-xs text-charcoal/80">{selected.paystackDetails.transactionId}</span>
                                                    {selected.paystackDetails.domain && <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-charcoal/5 text-charcoal/60 tracking-wider">{selected.paystackDetails.domain}</span>}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <CheckCircle size={14} className="text-emerald-500" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Status</span>
                                                <PaymentStatusBadge status={selected.paymentStatus} />
                                                {selected.paystackDetails.gatewayResponse && <span className="text-charcoal/50 text-xs">- {selected.paystackDetails.gatewayResponse}</span>}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm font-sans">
                                                <DollarSign size={14} className="text-charcoal/30" />
                                                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Amount</span>
                                                <span className="font-semibold text-charcoal">{formatMoney(selected.paystackDetails.amount ?? selected.total, storeCurrency)}</span>
                                            </div>
                                            {selected.paystackDetails.requestedAmount != null && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <DollarSign size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Requested</span>
                                                    <span className="text-charcoal/70">{formatMoney(selected.paystackDetails.requestedAmount, storeCurrency)}</span>
                                                </div>
                                            )}
                                            {selected.paystackDetails.fees != null && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <DollarSign size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Fees</span>
                                                    <span className="text-charcoal/70">{formatMoney(selected.paystackDetails.fees, storeCurrency)}</span>
                                                </div>
                                            )}
                                            {selected.paystackDetails.channel && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <CreditCard size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Channel</span>
                                                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-charcoal/5 text-charcoal/60 tracking-wider">{selected.paystackDetails.channel}</span>
                                                </div>
                                            )}
                                            {selected.paystackDetails.customerEmail && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <Mail size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Payer Email</span>
                                                    <span className="text-charcoal/70">{selected.paystackDetails.customerEmail}</span>
                                                </div>
                                            )}
                                            {(selected.paystackDetails.customerFirstName || selected.paystackDetails.customerLastName) && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <Mail size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Customer</span>
                                                    <span className="text-charcoal/70">{[selected.paystackDetails.customerFirstName, selected.paystackDetails.customerLastName].filter(Boolean).join(' ')}</span>
                                                </div>
                                            )}
                                            {selected.paystackDetails.paidAt && (
                                                <div className="flex items-center gap-3 text-sm font-sans">
                                                    <Clock size={14} className="text-charcoal/30" />
                                                    <span className="text-charcoal/50 text-[10px] uppercase tracking-wider w-20 shrink-0">Paid At</span>
                                                    <span className="text-charcoal/70">{formatDateTime(selected.paystackDetails.paidAt)}</span>
                                                </div>
                                            )}
                                            {(selected.paystackDetails.history?.length ?? 0) > 0 && (
                                                <div className="pt-2">
                                                    <h5 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3">Transaction Timeline</h5>
                                                    <div className="space-y-2">
                                                        {selected.paystackDetails.history?.map((entry, index) => (
                                                            <div key={`${entry.type}-${entry.time}-${index}`} className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 border border-charcoal/5">
                                                                <span className={`mt-1 h-2 w-2 rounded-full ${entry.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-charcoal/80">{entry.message}</p>
                                                                    <p className="text-[10px] uppercase tracking-wider text-charcoal/40">{entry.type} - {entry.time}s</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <a
                                                href="https://dashboard.paystack.com/#/transactions"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-moss/10 text-moss text-xs font-sans font-semibold hover:bg-moss/20 transition-colors"
                                            >
                                                <ExternalLink size={12} /> View on Paystack Dashboard
                                            </a>
                                        </>
                                    )}
                                </div>
                            )}

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
                                            {selected.items.map((item, index) => (
                                                <tr key={index} className="border-b border-charcoal/[0.03] last:border-0">
                                                    <td className="px-4 py-3 text-sm font-sans text-charcoal/80">{item.productName}</td>
                                                    <td className="px-3 py-3 text-sm font-sans text-charcoal/60 text-center">{item.quantity}</td>
                                                    <td className="px-3 py-3 text-sm font-sans text-charcoal/60 text-right">{formatMoney(item.price, storeCurrency)}</td>
                                                    <td className="px-3 py-3 text-sm font-sans text-charcoal/60 text-right">{formatMoney(item.discount ?? 0, storeCurrency)}</td>
                                                    <td className="px-4 py-3 text-sm font-sans font-semibold text-charcoal text-right">{formatMoney((item.price * item.quantity) - (item.discount ?? 0), storeCurrency)}</td>
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
                                        <span>{formatMoney(selected.items.reduce((sum, item) => sum + item.price * item.quantity, 0), storeCurrency)}</span>
                                    </div>
                                    {(selected.discountAmount ?? 0) > 0 && (
                                        <div className="flex justify-between text-sm font-sans text-red-500">
                                            <span>Discount {selected.discountCode ? `(${selected.discountCode})` : ''}</span>
                                            <span>-{formatMoney(selected.discountAmount ?? 0, storeCurrency)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm font-sans text-charcoal/60">
                                        <span>Shipping</span>
                                        <span>{formatMoney(selected.shippingCost ?? 0, storeCurrency)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-sans text-charcoal/60">
                                        <span>Tax (VAT)</span>
                                        <span>{formatMoney(selected.tax ?? 0, storeCurrency)}</span>
                                    </div>
                                    <div className="border-t border-charcoal/10 pt-2 flex justify-between">
                                        <span className="font-serif italic text-lg text-charcoal">Store Total</span>
                                        <span className="font-serif italic text-lg text-charcoal">{formatMoney(selected.total, storeCurrency)}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-sans text-charcoal/30 uppercase tracking-wider">
                                        <span>Store Currency</span>
                                        <span>{storeCurrency}</span>
                                    </div>
                                    {selected.paymentAmount != null && selected.paymentCurrency && (
                                        <div className="border-t border-charcoal/10 pt-2 flex justify-between text-sm font-sans text-charcoal/70">
                                            <span>Paid Amount</span>
                                            <span>{formatMoney(selected.paymentAmount, selected.paymentCurrency)}</span>
                                        </div>
                                    )}
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
