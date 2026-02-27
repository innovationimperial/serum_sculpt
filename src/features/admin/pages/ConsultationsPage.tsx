import React, { useState, useMemo } from 'react';
import { Mail, MessageSquare, AlertCircle, X, Tag } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { StatCard } from '../components/StatCard';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

const ConsultationsPage: React.FC = () => {
    const inquiries = useQuery(api.contactInquiries.list, {});
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (!inquiries) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading inquiries...</div>
            </div>
        );
    }

    const selected = selectedId ? inquiries.find(c => c._id === selectedId) : null;

    const columns = [
        {
            key: 'fullName' as const,
            label: 'Client Name',
            sortable: true,
            render: (_: unknown, row: typeof inquiries[0]) => (
                <div>
                    <p className="font-semibold text-charcoal">{row.fullName}</p>
                    <p className="text-[10px] text-charcoal/40">{row.email}</p>
                </div>
            ),
        },
        {
            key: 'purpose' as const,
            label: 'Purpose (Reason)',
            sortable: true,
            width: '200px',
            render: (_: unknown, row: typeof inquiries[0]) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-moss/10 text-moss">
                    {row.purpose}
                </span>
            ),
        },
        {
            key: 'message' as const,
            label: 'Message Preview',
            render: (_: unknown, row: typeof inquiries[0]) => (
                <p className="text-sm font-sans text-charcoal/70 truncate max-w-xs">
                    {row.message}
                </p>
            ),
        },
        {
            key: 'created' as const,
            label: 'Time',
            render: (_: unknown, row: typeof inquiries[0]) => (
                <p className="text-xs text-charcoal/50">
                    {new Date(row._creationTime).toLocaleDateString()} {new Date(row._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            ),
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-serif italic text-moss">Consultations / Inquiries</h1>
                    <p className="text-sm font-sans text-charcoal/60 mt-1">Review inquiries submitted from the public contact form.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Total Inquiries" value={String(inquiries.length)} icon={<AlertCircle size={18} />} change="+0%" />
                <StatCard label="Clinical Consultations" value={String(inquiries.filter(i => i.purpose === 'Clinical Consultation').length)} icon={<AlertCircle size={18} />} change="+0%" />
                <StatCard label="Program Applications" value={String(inquiries.filter(i => i.purpose === 'Program Application').length)} icon={<Tag size={18} />} change="+0%" />
            </div>

            {/* Table */}
            <DataTable
                columns={columns as any}
                data={inquiries.map(c => ({ ...c, id: c._id })) as any}
                onRowClick={(row: any) => setSelectedId(row._id)}
                emptyMessage="No inquiries found."
            />

            {/* Simple Detail Panel */}
            {selected && (
                <>
                    <div className="fixed inset-0 z-[80] bg-charcoal/30 backdrop-blur-sm" onClick={() => setSelectedId(null)} />
                    <div className="fixed top-0 right-0 z-[85] h-full w-full max-w-lg bg-white shadow-2xl animate-[slideIn_0.3s_ease-out] overflow-y-auto">
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-charcoal/5 p-6 flex items-start justify-between z-10">
                            <div>
                                <h2 className="font-serif italic text-2xl text-charcoal mb-1">{selected.fullName}</h2>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-moss/10 text-moss`}>
                                    {selected.purpose}
                                </span>
                            </div>
                            <button onClick={() => setSelectedId(null)} className="p-1 text-charcoal/30 hover:text-charcoal transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-stone rounded-xl p-5 space-y-3">
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <Mail size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">{selected.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <Tag size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">Reason: {selected.purpose}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-sans">
                                    <AlertCircle size={14} className="text-charcoal/30" />
                                    <span className="text-charcoal/70">Submitted: {new Date(selected._creationTime).toLocaleString()}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3 flex items-center gap-2">
                                    <MessageSquare size={12} /> Inquiry Message
                                </h4>
                                <div className="text-sm font-sans text-charcoal/70 leading-relaxed bg-sage/10 rounded-xl p-4 border-l-4 border-moss/30 whitespace-pre-wrap">
                                    {selected.message}
                                </div>
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

export default ConsultationsPage;
