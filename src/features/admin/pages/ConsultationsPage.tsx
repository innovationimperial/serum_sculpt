import React, { useState, useMemo } from 'react';
import { CalendarCheck, Clock, Users, AlertCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { StatCard } from '../components/StatCard';
import { ConsultationDetail } from '../components/ConsultationDetail';
import { MOCK_CONSULTATIONS } from '../data/mockData';
import type { Consultation, ConsultationNote, ConsultationStatus } from '../types';

type TabFilter = 'all' | 'upcoming' | 'completed' | 'cancelled';

const ConsultationsPage: React.FC = () => {
    const [consultations, setConsultations] = useState<Consultation[]>(MOCK_CONSULTATIONS);
    const [activeTab, setActiveTab] = useState<TabFilter>('all');
    const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

    // Counts
    const confirmed = consultations.filter(c => c.status === 'confirmed').length;
    const pending = consultations.filter(c => c.status === 'pending').length;
    const completed = consultations.filter(c => c.status === 'completed').length;
    const thisWeek = consultations.filter(c =>
        c.status === 'confirmed' || c.status === 'pending'
    ).length;

    // Filtered data based on tab
    const filtered = useMemo(() => {
        switch (activeTab) {
            case 'upcoming':
                return consultations.filter(c => c.status === 'confirmed' || c.status === 'pending');
            case 'completed':
                return consultations.filter(c => c.status === 'completed');
            case 'cancelled':
                return consultations.filter(c => c.status === 'cancelled');
            default:
                return consultations;
        }
    }, [consultations, activeTab]);

    const statusColors: Record<string, string> = {
        confirmed: 'bg-moss/10 text-moss',
        pending: 'bg-amber-50 text-amber-600',
        completed: 'bg-blue-50 text-blue-600',
        cancelled: 'bg-charcoal/5 text-charcoal/30 line-through',
    };

    const tabs: { key: TabFilter; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: consultations.length },
        { key: 'upcoming', label: 'Upcoming', count: thisWeek },
        { key: 'completed', label: 'Completed', count: completed },
        { key: 'cancelled', label: 'Cancelled', count: consultations.filter(c => c.status === 'cancelled').length },
    ];

    const handleUpdateNotes = (id: string, notes: ConsultationNote[]) => {
        setConsultations(prev => prev.map(c => c.id === id ? { ...c, notes } : c));
        // Also update the selected consultation if it's still open
        setSelectedConsultation(prev => prev && prev.id === id ? { ...prev, notes } : prev);
    };

    const handleUpdateStatus = (id: string, status: ConsultationStatus) => {
        setConsultations(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        setSelectedConsultation(prev => prev && prev.id === id ? { ...prev, status } : prev);
    };

    const columns = [
        {
            key: 'clientName' as keyof Consultation,
            label: 'Client',
            sortable: true,
            render: (_: Consultation[keyof Consultation], row: Consultation) => (
                <div>
                    <p className="font-semibold text-charcoal">{row.clientName}</p>
                    <p className="text-[10px] text-charcoal/40">{row.clientEmail}</p>
                </div>
            ),
        },
        {
            key: 'date' as keyof Consultation,
            label: 'Date & Time',
            sortable: true,
            width: '150px',
            render: (_: Consultation[keyof Consultation], row: Consultation) => (
                <div>
                    <p className="text-charcoal/80">{row.date}</p>
                    <p className="text-[10px] text-charcoal/40">{row.time}</p>
                </div>
            ),
        },
        {
            key: 'type' as keyof Consultation,
            label: 'Type',
            sortable: true,
            width: '160px',
        },
        {
            key: 'status' as keyof Consultation,
            label: 'Status',
            sortable: true,
            width: '120px',
            render: (val: Consultation[keyof Consultation]) => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[String(val)]}`}>
                    {String(val)}
                </span>
            ),
        },
        {
            key: 'notes' as keyof Consultation,
            label: 'Notes',
            width: '80px',
            render: (_: Consultation[keyof Consultation], row: Consultation) => (
                <span className={`text-sm font-sans font-medium ${row.notes.length > 0 ? 'text-moss' : 'text-charcoal/20'}`}>
                    {row.notes.length} {row.notes.length === 1 ? 'note' : 'notes'}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    label="This Week"
                    value={String(thisWeek)}
                    change={8.1}
                    icon={<CalendarCheck size={20} />}
                />
                <StatCard
                    label="Confirmed"
                    value={String(confirmed)}
                    change={12.0}
                    icon={<Clock size={20} />}
                />
                <StatCard
                    label="Pending"
                    value={String(pending)}
                    change={-5.0}
                    icon={<AlertCircle size={20} />}
                />
                <StatCard
                    label="Completed"
                    value={String(completed)}
                    change={20.0}
                    icon={<Users size={20} />}
                />
            </div>

            {/* Tab filters */}
            <div className="flex items-center gap-1 bg-white rounded-xl border border-charcoal/5 p-1 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans font-medium transition-all duration-200 cursor-pointer ${activeTab === tab.key
                                ? 'bg-moss text-white shadow-sm'
                                : 'text-charcoal/40 hover:text-charcoal/60'
                            }`}
                    >
                        {tab.label}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key
                                ? 'bg-white/20'
                                : 'bg-charcoal/5'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filtered}
                onRowClick={(row) => setSelectedConsultation(row)}
                emptyMessage={
                    activeTab === 'all'
                        ? 'No consultations booked yet.'
                        : `No ${activeTab} consultations.`
                }
            />

            {/* Hint */}
            {filtered.length > 0 && (
                <p className="text-xs font-sans text-charcoal/25 text-center">
                    Click any row to view details, manage notes, or update status.
                </p>
            )}

            {/* Detail slide-over */}
            <ConsultationDetail
                consultation={selectedConsultation}
                onClose={() => setSelectedConsultation(null)}
                onUpdateNotes={handleUpdateNotes}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
};

export default ConsultationsPage;
