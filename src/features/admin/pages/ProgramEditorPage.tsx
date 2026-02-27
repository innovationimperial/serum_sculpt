import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

type ProgramStatus = 'active' | 'draft' | 'archived';
const STATUSES: ProgramStatus[] = ['active', 'draft', 'archived'];

interface ProgramPhase {
    name: string;
    durationWeeks: number;
    description: string;
}

const ProgramEditorPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const isNew = !id;

    const existingProgram = useQuery(api.programs.get, id ? { id: id as Id<"programs"> } : "skip");
    const createProgram = useMutation(api.programs.create);
    const updateProgram = useMutation(api.programs.update);
    const removeProgram = useMutation(api.programs.remove);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<ProgramStatus>('draft');
    const [phases, setPhases] = useState<ProgramPhase[]>([{ name: '', durationWeeks: 1, description: '' }]);
    const [outcomes, setOutcomes] = useState<string[]>(['']);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (existingProgram) {
            setName(existingProgram.name);
            setDescription(existingProgram.description);
            setStatus(existingProgram.status);
            setPhases(existingProgram.phases);
            setOutcomes(existingProgram.outcomes);
        }
    }, [existingProgram]);

    const handleSave = async () => {
        const cleanPhases = phases.filter(p => p.name.trim());
        const cleanOutcomes = outcomes.filter(o => o.trim());
        if (isNew) {
            await createProgram({ name, description, status, phases: cleanPhases, outcomes: cleanOutcomes });
            addToast('Program created', 'success');
        } else {
            await updateProgram({ id: id as Id<"programs">, name, description, status, phases: cleanPhases, outcomes: cleanOutcomes });
            addToast('Program updated', 'success');
        }
        navigate('/admin/programs');
    };

    const handleDelete = async () => {
        if (!id) return;
        await removeProgram({ id: id as Id<"programs"> });
        addToast('Program deleted', 'success');
        navigate('/admin/programs');
    };

    const addPhase = () => setPhases(prev => [...prev, { name: '', durationWeeks: 1, description: '' }]);
    const removePhase = (index: number) => setPhases(prev => prev.filter((_, i) => i !== index));
    const updatePhase = (index: number, field: keyof ProgramPhase, value: string | number) => {
        setPhases(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
    };

    const addOutcome = () => setOutcomes(prev => [...prev, '']);
    const removeOutcome = (index: number) => setOutcomes(prev => prev.filter((_, i) => i !== index));
    const updateOutcome = (index: number, value: string) => {
        setOutcomes(prev => prev.map((o, i) => i === index ? value : o));
    };

    if (!isNew && existingProgram === undefined) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-serif italic text-moss text-xl animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link to="/admin/programs" className="flex items-center gap-2 text-sm text-charcoal/50 hover:text-moss transition-colors font-sans">
                    <ArrowLeft size={16} /> Back to Programs
                </Link>
                <div className="flex gap-3">
                    {!isNew && (
                        <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-sm font-sans font-semibold text-red-400 hover:bg-red-50 transition-colors cursor-pointer">
                            <Trash2 size={14} /> Delete
                        </button>
                    )}
                    <button onClick={handleSave} className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors cursor-pointer">
                        <Save size={14} /> {isNew ? 'Create Program' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <h3 className="font-serif italic text-lg text-charcoal">Program Details</h3>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Program Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors" />
                </div>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors resize-none" />
                </div>
                <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as ProgramStatus)} className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors appearance-none">
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
            </div>

            {/* Phases */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-serif italic text-lg text-charcoal">Phases</h3>
                    <button onClick={addPhase} className="flex items-center gap-1.5 text-moss text-xs font-sans font-semibold hover:text-charcoal transition-colors cursor-pointer"><Plus size={14} /> Add Phase</button>
                </div>
                {phases.map((phase, i) => (
                    <div key={i} className="p-4 border border-charcoal/5 rounded-xl space-y-3 relative group">
                        <button onClick={() => removePhase(i)} className="absolute top-3 right-3 text-charcoal/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"><X size={14} /></button>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-1">Phase Name</label>
                                <input type="text" value={phase.name} onChange={e => updatePhase(i, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-1">Weeks</label>
                                <input type="number" value={phase.durationWeeks} onChange={e => updatePhase(i, 'durationWeeks', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-1">Description</label>
                            <textarea value={phase.description} onChange={e => updatePhase(i, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 resize-none" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Outcomes */}
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-serif italic text-lg text-charcoal">Expected Outcomes</h3>
                    <button onClick={addOutcome} className="flex items-center gap-1.5 text-moss text-xs font-sans font-semibold hover:text-charcoal transition-colors cursor-pointer"><Plus size={14} /> Add</button>
                </div>
                {outcomes.map((outcome, i) => (
                    <div key={i} className="flex gap-2 group">
                        <input type="text" value={outcome} onChange={e => updateOutcome(i, e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal focus:outline-none focus:border-moss/40 transition-colors" placeholder="Outcome..." />
                        <button onClick={() => removeOutcome(i)} className="text-charcoal/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer p-2"><X size={14} /></button>
                    </div>
                ))}
            </div>

            <ConfirmDialog isOpen={showDelete} title="Delete Program" message={`Are you sure you want to delete "${name}"?`} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} confirmLabel="Delete" variant="danger" />
        </div>
    );
};

export default ProgramEditorPage;
