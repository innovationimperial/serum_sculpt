import React, { useState, useMemo } from 'react';
import { Users, CheckCircle, FileEdit, Archive, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROGRAMS } from '../data/mockData';
import { SearchFilter } from '../components/SearchFilter';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import type { WellnessProgram, ProgramStatus } from '../types';

const ProgramsPage: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [programs, setPrograms] = useState<WellnessProgram[]>(MOCK_PROGRAMS);
    const [deleteTarget, setDeleteTarget] = useState<WellnessProgram | null>(null);

    const statusConfig: Record<string, { color: string; icon: React.ReactNode; bg: string }> = {
        active: { color: 'text-moss', icon: <CheckCircle size={14} />, bg: 'bg-moss/10' },
        draft: { color: 'text-charcoal/40', icon: <FileEdit size={14} />, bg: 'bg-charcoal/5' },
        archived: { color: 'text-charcoal/30', icon: <Archive size={14} />, bg: 'bg-charcoal/5' },
        all: { color: 'text-charcoal/60', icon: null, bg: 'bg-charcoal/5' }
    };

    const statusOptions = [
        { label: 'All Status', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
    ];

    const filteredPrograms = useMemo(() => {
        return programs.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [programs, searchTerm, statusFilter]);

    const handleToggleStatus = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPrograms(prev => prev.map(p => {
            if (p.id === id) {
                const nextStatus: ProgramStatus = p.status === 'active' ? 'draft' : 'active';
                toast('info', `Program status updated to ${nextStatus}`);
                return { ...p, status: nextStatus };
            }
            return p;
        }));
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setPrograms(prev => prev.filter(p => p.id !== deleteTarget.id));
        toast('success', `"${deleteTarget.name}" deleted successfully`);
        setDeleteTarget(null);
    };

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-6 text-sm font-sans">
                    <span className="text-charcoal/80 font-semibold">{programs.length} programs</span>
                    <span className="text-charcoal/20">·</span>
                    <span className="text-charcoal/40">
                        {programs.filter(p => p.status === 'active').length} active
                    </span>
                    <span className="text-charcoal/20">·</span>
                    <span className="flex items-center gap-1 text-moss">
                        <Users size={12} />
                        {programs.reduce((s, p) => s + p.enrolledCount, 0)} total enrolled
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <SearchFilter
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterValue={statusFilter}
                        onFilterChange={setStatusFilter}
                        filterOptions={statusOptions}
                        searchPlaceholder="Search programs..."
                    />
                    <button
                        onClick={() => navigate('/admin/programs/new')}
                        className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors duration-200 cursor-pointer"
                    >
                        <Plus size={16} />
                        New Program
                    </button>
                </div>
            </div>

            {/* Program cards */}
            {filteredPrograms.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredPrograms.map(program => {
                        const s = statusConfig[program.status];
                        return (
                            <div
                                key={program.id}
                                onClick={() => navigate(`/admin/programs/${program.id}`)}
                                className="bg-white rounded-2xl border border-charcoal/5 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group relative"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-serif italic text-xl text-charcoal mb-1 leading-snug group-hover:text-moss transition-colors">{program.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.bg} ${s.color}`}>
                                                {s.icon}
                                                {program.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-sage/30 text-moss px-3 py-1.5 rounded-full flex-shrink-0 ml-3">
                                        <Users size={13} />
                                        <span className="text-sm font-sans font-semibold">{program.enrolledCount}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="font-sans text-sm text-charcoal/60 leading-relaxed mb-5 line-clamp-2">{program.description}</p>

                                {/* Phases Summary */}
                                <div className="mb-5 flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/30">Phases</p>
                                        <span className="text-[10px] font-sans text-charcoal/40 bg-stone px-1.5 py-0.5 rounded">
                                            {program.phases.reduce((acc, p) => acc + p.durationWeeks, 0)} weeks total
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {program.phases.slice(0, 2).map((phase, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-sage/40 flex items-center justify-center text-[9px] font-sans font-bold text-moss flex-shrink-0">
                                                    {i + 1}
                                                </div>
                                                <p className="text-xs font-sans text-charcoal/70 truncate">{phase.name}</p>
                                            </div>
                                        ))}
                                        {program.phases.length > 2 && (
                                            <p className="text-[10px] text-charcoal/30 ml-8">+ {program.phases.length - 2} more phases</p>
                                        )}
                                    </div>
                                </div>

                                {/* Outcomes */}
                                <div className="border-t border-charcoal/5 pt-4">
                                    <p className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/30 mb-2">Key Outcomes</p>
                                    <div className="flex flex-wrap gap-2">
                                        {program.outcomes.slice(0, 2).map((outcome, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 rounded-lg bg-sage/20 text-moss text-[9px] font-sans font-semibold border border-moss/5"
                                            >
                                                {outcome}
                                            </span>
                                        ))}
                                        {program.outcomes.length > 2 && (
                                            <span className="text-[9px] text-charcoal/40 self-center">+{program.outcomes.length - 2}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions Hover */}
                                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                                    <button
                                        onClick={(e) => handleToggleStatus(program.id, e)}
                                        className="p-2 rounded-lg bg-white text-charcoal/40 hover:text-moss border border-charcoal/5 shadow-sm transition-colors"
                                        title={program.id === 'active' ? 'Move to Draft' : 'Activate'}
                                    >
                                        {program.status === 'active' ? <Archive size={14} /> : <CheckCircle size={14} />}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteTarget(program);
                                        }}
                                        className="p-2 rounded-lg bg-white text-charcoal/40 hover:text-red-500 border border-charcoal/5 shadow-sm transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-charcoal/5 p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center text-moss mb-4">
                        <Users size={32} />
                    </div>
                    <h3 className="font-serif italic text-2xl text-charcoal mb-2">No programs found</h3>
                    <p className="font-sans text-sm text-charcoal/40 max-w-xs mb-8">
                        No wellness programs match your search criteria. Try a different search term or filter.
                    </p>
                    <button
                        onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                        className="text-moss font-sans text-sm font-bold hover:underline cursor-pointer"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Deletion confirmation */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Program"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? All enrollment data associated with this program will be lost.`}
                confirmLabel="Delete Program"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default ProgramsPage;

