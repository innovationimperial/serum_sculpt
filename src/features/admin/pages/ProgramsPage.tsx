import React, { useState, useMemo } from 'react';
import { Users, CheckCircle, FileEdit, Archive, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchFilter } from '../components/SearchFilter';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

type ProgramStatus = 'active' | 'draft' | 'archived';

const ProgramsPage: React.FC = () => {
    const programs = useQuery(api.programs.list, {});
    const removeProgram = useMutation(api.programs.remove);
    const toggleProgramStatus = useMutation(api.programs.toggleStatus);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [deleteTarget, setDeleteTarget] = useState<{ _id: Id<"programs">; name: string } | null>(null);

    const filtered = useMemo(() => {
        if (!programs) return [];
        return programs.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchesStat = filterStatus === 'All' || p.status === filterStatus.toLowerCase();
            return matchesSearch && matchesStat;
        });
    }, [programs, search, filterStatus]);

    if (!programs) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading programs...</div>
            </div>
        );
    }

    const handleToggleStatus = async (id: Id<"programs">, e: React.MouseEvent) => {
        e.stopPropagation();
        await toggleProgramStatus({ id });
        addToast('Status updated', 'success');
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await removeProgram({ id: deleteTarget._id });
        setDeleteTarget(null);
        addToast('Program deleted', 'success');
    };

    const activeCount = programs.filter(p => p.status === 'active').length;
    const draftCount = programs.filter(p => p.status === 'draft').length;
    const archivedCount = programs.filter(p => p.status === 'archived').length;
    const totalEnrolled = programs.reduce((sum, p) => sum + p.enrolledCount, 0);

    const statusColor: Record<ProgramStatus, string> = {
        active: 'bg-moss/10 text-moss',
        draft: 'bg-charcoal/5 text-charcoal/40',
        archived: 'bg-red-50 text-red-400',
    };
    const statusIcon: Record<ProgramStatus, React.ReactNode> = {
        active: <CheckCircle size={14} />,
        draft: <FileEdit size={14} />,
        archived: <Archive size={14} />,
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-charcoal/5 p-5 text-center">
                    <p className="text-2xl font-bold text-charcoal font-sans">{activeCount}</p>
                    <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-widest font-bold mt-1">Active</p>
                </div>
                <div className="bg-white rounded-2xl border border-charcoal/5 p-5 text-center">
                    <p className="text-2xl font-bold text-charcoal font-sans">{draftCount}</p>
                    <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-widest font-bold mt-1">Drafts</p>
                </div>
                <div className="bg-white rounded-2xl border border-charcoal/5 p-5 text-center">
                    <p className="text-2xl font-bold text-charcoal font-sans">{archivedCount}</p>
                    <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-widest font-bold mt-1">Archived</p>
                </div>
                <div className="bg-white rounded-2xl border border-charcoal/5 p-5 text-center">
                    <p className="text-2xl font-bold text-moss font-sans">{totalEnrolled}</p>
                    <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-widest font-bold mt-1">Enrolled</p>
                </div>
            </div>

            {/* Search + New */}
            <div className="flex items-center justify-between gap-4">
                <SearchFilter searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search programs..." filterValue={filterStatus} onFilterChange={setFilterStatus} filterOptions={[{ value: 'All', label: 'All' }, { value: 'Active', label: 'Active' }, { value: 'Draft', label: 'Draft' }, { value: 'Archived', label: 'Archived' }]} filterLabel="Status" />
                <button onClick={() => navigate('/admin/programs/new')} className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors duration-200 cursor-pointer">
                    <Plus size={16} /> New Program
                </button>
            </div>

            {/* Program cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filtered.map(program => (
                    <div key={program._id} onClick={() => navigate(`/admin/programs/${program._id}`)} className="bg-white rounded-2xl border border-charcoal/5 p-6 hover:shadow-lg hover:border-moss/20 transition-all duration-200 cursor-pointer group">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-serif italic text-xl text-charcoal group-hover:text-moss transition-colors">{program.name}</h3>
                                <p className="text-xs font-sans text-charcoal/50 mt-1 line-clamp-2">{program.description}</p>
                            </div>
                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor[program.status]}`}>
                                {statusIcon[program.status]} {program.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-sans mb-4">
                            <span className="flex items-center gap-1.5 text-charcoal/50"><Users size={14} /> {program.enrolledCount} enrolled</span>
                            <span className="text-charcoal/30">{program.phases.length} phases</span>
                            <span className="text-charcoal/30">{program.outcomes.length} outcomes</span>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-charcoal/5">
                            <button onClick={(e) => handleToggleStatus(program._id, e)} className="text-xs font-sans text-charcoal/40 hover:text-moss transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-moss/5">
                                Toggle Status
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteTarget({ _id: program._id, name: program.name }); }} className="text-xs font-sans text-charcoal/20 hover:text-red-500 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-red-50 ml-auto">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-charcoal/30 font-sans">No programs found.</div>
            )}

            <ConfirmDialog isOpen={!!deleteTarget} title="Delete Program" message={`Are you sure you want to delete "${deleteTarget?.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} confirmLabel="Delete" variant="danger" />
        </div>
    );
};

export default ProgramsPage;
