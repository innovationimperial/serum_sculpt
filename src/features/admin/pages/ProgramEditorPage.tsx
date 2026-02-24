import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, X, GripVertical } from 'lucide-react';
import { MOCK_PROGRAMS } from '../data/mockData';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import type { ProgramPhase, ProgramStatus } from '../types';

const STATUSES: ProgramStatus[] = ['active', 'draft', 'archived'];

const ProgramEditorPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const existing = id ? MOCK_PROGRAMS.find(p => p.id === id) : null;
    const isNew = !id;

    const [name, setName] = useState(existing?.name || '');
    const [description, setDescription] = useState(existing?.description || '');
    const [status, setStatus] = useState<ProgramStatus>(existing?.status || 'draft');
    const [phases, setPhases] = useState<ProgramPhase[]>(existing?.phases || [
        { name: '', durationWeeks: 1, description: '' }
    ]);
    const [outcomes, setOutcomes] = useState<string[]>(existing?.outcomes || ['']);
    const [showDelete, setShowDelete] = useState(false);

    const statusColors: Record<ProgramStatus, string> = {
        active: 'bg-moss/10 text-moss border-moss/20',
        draft: 'bg-charcoal/5 text-charcoal/40 border-charcoal/10',
        archived: 'bg-stone text-charcoal/30 border-charcoal/10',
    };

    const handleSave = () => {
        if (!name.trim()) {
            toast('error', 'Program name is required');
            return;
        }
        if (phases.some(p => !p.name.trim())) {
            toast('error', 'All phases must have a name');
            return;
        }
        toast('success', isNew ? 'Program created successfully!' : 'Program updated successfully!');
        setTimeout(() => navigate('/admin/programs'), 500);
    };

    const handleDelete = () => {
        toast('success', `"${name}" has been deleted`);
        setShowDelete(false);
        setTimeout(() => navigate('/admin/programs'), 500);
    };

    const addPhase = () => setPhases([...phases, { name: '', durationWeeks: 1, description: '' }]);
    const removePhase = (index: number) => setPhases(phases.filter((_, i) => i !== index));
    const updatePhase = (index: number, field: keyof ProgramPhase, value: string | number) => {
        setPhases(phases.map((p, i) => i === index ? { ...p, [field]: value } : p));
    };

    const addOutcome = () => setOutcomes([...outcomes, '']);
    const removeOutcome = (index: number) => setOutcomes(outcomes.filter((_, i) => i !== index));
    const updateOutcome = (index: number, value: string) => {
        setOutcomes(outcomes.map((o, i) => i === index ? value : o));
    };

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <Link
                    to="/admin/programs"
                    className="flex items-center gap-2 text-sm font-sans text-charcoal/50 hover:text-charcoal transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back to Programs
                </Link>
                <div className="flex items-center gap-3">
                    {!isNew && (
                        <button
                            onClick={() => setShowDelete(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-sans text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors duration-200 cursor-pointer"
                    >
                        <Save size={14} />
                        {isNew ? 'Create Program' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-5">
                        <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Program Details</h3>
                        <div>
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Program Name *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Enter program name..."
                                className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-serif italic text-xl text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Overview description</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="High-level overview of the program..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Phases */}
                    <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-5">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40">Program Phases</h3>
                            <button
                                onClick={addPhase}
                                className="flex items-center gap-1.5 text-xs font-sans font-bold text-moss hover:text-charcoal transition-colors cursor-pointer"
                            >
                                <Plus size={14} /> Add Phase
                            </button>
                        </div>
                        <div className="space-y-4">
                            {phases.map((phase, idx) => (
                                <div key={idx} className="relative bg-stone/30 rounded-xl p-5 group">
                                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <GripVertical size={16} className="text-charcoal/20" />
                                    </div>
                                    <button
                                        onClick={() => removePhase(idx)}
                                        className="absolute top-4 right-4 text-charcoal/20 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div className="col-span-3">
                                            <label className="block text-[9px] font-sans uppercase tracking-wider font-bold text-charcoal/30 mb-1.5">Phase Name</label>
                                            <input
                                                type="text"
                                                value={phase.name}
                                                onChange={e => updatePhase(idx, 'name', e.target.value)}
                                                placeholder="Phase title..."
                                                className="w-full px-3 py-2 rounded-lg border border-charcoal/5 bg-white font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-sans uppercase tracking-wider font-bold text-charcoal/30 mb-1.5">Weeks</label>
                                            <input
                                                type="number"
                                                value={phase.durationWeeks}
                                                onChange={e => updatePhase(idx, 'durationWeeks', parseInt(e.target.value) || 1)}
                                                className="w-full px-3 py-2 rounded-lg border border-charcoal/5 bg-white font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-sans uppercase tracking-wider font-bold text-charcoal/30 mb-1.5">Phase Goal/Description</label>
                                        <textarea
                                            value={phase.description}
                                            onChange={e => updatePhase(idx, 'description', e.target.value)}
                                            placeholder="What happens in this phase?"
                                            rows={2}
                                            className="w-full px-3 py-2 rounded-lg border border-charcoal/5 bg-white font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 resize-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status & Enrollment */}
                    <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                        <div>
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3">Publication Status</label>
                            <div className="space-y-2">
                                {STATUSES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-semibold transition-all duration-200 capitalize cursor-pointer ${status === s ? statusColors[s] : 'border-charcoal/5 text-charcoal/30 hover:border-charcoal/10'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {!isNew && (
                            <div className="pt-4 border-t border-charcoal/5">
                                <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-1">Current Enrollment</label>
                                <p className="text-2xl font-serif italic text-charcoal">{existing?.enrolledCount} <span className="text-sm font-sans italic text-charcoal/40 not-italic">members</span></p>
                            </div>
                        )}
                    </div>

                    {/* Outcomes */}
                    <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-5">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40">Expected Outcomes</h3>
                            <button
                                onClick={addOutcome}
                                className="text-moss hover:text-charcoal transition-colors cursor-pointer"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {outcomes.map((outcome, idx) => (
                                <div key={idx} className="flex gap-2 group">
                                    <input
                                        type="text"
                                        value={outcome}
                                        onChange={e => updateOutcome(idx, e.target.value)}
                                        placeholder="Add outcome..."
                                        className="flex-1 px-3 py-2 rounded-lg border border-charcoal/5 bg-stone/30 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40"
                                    />
                                    <button
                                        onClick={() => removeOutcome(idx)}
                                        className="p-1 text-charcoal/20 hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation */}
            <ConfirmDialog
                isOpen={showDelete}
                title="Delete Program"
                message={`Are you sure you want to delete "${name}"? This will permanently remove the program and all phase data.`}
                confirmLabel="Delete Program"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDelete(false)}
            />
        </div>
    );
};

export default ProgramEditorPage;
