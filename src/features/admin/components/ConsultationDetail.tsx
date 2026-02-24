import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, User, Mail, Phone, Calendar, Clock, Tag, FileText, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './Toast';
import type { Consultation, ConsultationNote, ConsultationStatus } from '../types';

interface ConsultationDetailProps {
    consultation: Consultation | null;
    onClose: () => void;
    onUpdateNotes: (consultationId: string, notes: ConsultationNote[]) => void;
    onUpdateStatus: (consultationId: string, status: ConsultationStatus) => void;
}

export const ConsultationDetail: React.FC<ConsultationDetailProps> = ({
    consultation,
    onClose,
    onUpdateNotes,
    onUpdateStatus,
}) => {
    const { toast } = useToast();
    const [newNote, setNewNote] = useState('');
    const [deleteNote, setDeleteNote] = useState<ConsultationNote | null>(null);
    const [confirmStatus, setConfirmStatus] = useState<ConsultationStatus | null>(null);

    // Keyboard: Escape to close
    useEffect(() => {
        if (!consultation) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [consultation, onClose]);

    if (!consultation) return null;

    const statusColors: Record<string, string> = {
        confirmed: 'bg-moss/10 text-moss',
        pending: 'bg-amber-50 text-amber-600',
        completed: 'bg-blue-50 text-blue-600',
        cancelled: 'bg-charcoal/5 text-charcoal/30',
    };

    const STATUS_ACTIONS: { status: ConsultationStatus; label: string; icon: React.ReactNode; color: string }[] = [
        { status: 'confirmed', label: 'Confirm', icon: <CheckCircle size={14} />, color: 'text-moss hover:bg-moss/10' },
        { status: 'completed', label: 'Complete', icon: <AlertCircle size={14} />, color: 'text-blue-600 hover:bg-blue-50' },
        { status: 'cancelled', label: 'Cancel', icon: <XCircle size={14} />, color: 'text-red-500 hover:bg-red-50' },
    ];

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const note: ConsultationNote = {
            id: `n-${Date.now()}`,
            text: newNote.trim(),
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            author: 'Admin',
        };
        onUpdateNotes(consultation.id, [...consultation.notes, note]);
        setNewNote('');
        toast('success', 'Note added');
    };

    const handleDeleteNote = () => {
        if (!deleteNote) return;
        onUpdateNotes(consultation.id, consultation.notes.filter(n => n.id !== deleteNote.id));
        setDeleteNote(null);
        toast('success', 'Note removed');
    };

    const handleStatusChange = () => {
        if (!confirmStatus) return;
        onUpdateStatus(consultation.id, confirmStatus);
        setConfirmStatus(null);
        toast('success', `Consultation marked as ${confirmStatus}`);
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[80] bg-charcoal/30 backdrop-blur-sm" onClick={onClose} />

            {/* Slide-over panel */}
            <div className="fixed top-0 right-0 z-[85] h-full w-full max-w-lg bg-white shadow-2xl animate-[slideIn_0.3s_ease-out] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-charcoal/5 p-6 flex items-start justify-between z-10">
                    <div>
                        <h2 className="font-serif italic text-2xl text-charcoal mb-1">{consultation.clientName}</h2>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[consultation.status]}`}>
                            {consultation.status}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-1 text-charcoal/30 hover:text-charcoal transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Client info */}
                    <div className="bg-stone rounded-xl p-5 space-y-3">
                        <div className="flex items-center gap-3 text-sm font-sans">
                            <Mail size={14} className="text-charcoal/30" />
                            <span className="text-charcoal/70">{consultation.clientEmail}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-sans">
                            <Phone size={14} className="text-charcoal/30" />
                            <span className="text-charcoal/70">{consultation.clientPhone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-sans">
                            <Calendar size={14} className="text-charcoal/30" />
                            <span className="text-charcoal/70">{consultation.date}</span>
                            <Clock size={14} className="text-charcoal/30 ml-2" />
                            <span className="text-charcoal/70">{consultation.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-sans">
                            <Tag size={14} className="text-charcoal/30" />
                            <span className="text-charcoal/70">{consultation.type}</span>
                        </div>
                    </div>

                    {/* Pre-consultation notes */}
                    <div>
                        <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3 flex items-center gap-2">
                            <FileText size={12} /> Pre-consultation Notes
                        </h4>
                        <p className="text-sm font-sans text-charcoal/70 leading-relaxed bg-sage/10 rounded-xl p-4 border-l-4 border-moss/30">
                            {consultation.preConsultationNotes}
                        </p>
                    </div>

                    {/* Status actions */}
                    {consultation.status !== 'completed' && consultation.status !== 'cancelled' && (
                        <div>
                            <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-3">Actions</h4>
                            <div className="flex items-center gap-2">
                                {STATUS_ACTIONS
                                    .filter(a => a.status !== consultation.status)
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

                    {/* Note timeline */}
                    <div>
                        <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-4 flex items-center gap-2">
                            <MessageSquare size={12} /> Notes Timeline ({consultation.notes.length})
                        </h4>

                        {consultation.notes.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare size={28} className="mx-auto text-charcoal/10 mb-3" />
                                <p className="text-sm font-sans text-charcoal/30">No notes yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-0">
                                {consultation.notes.map((note, idx) => (
                                    <div key={note.id} className="relative pl-6 pb-5 group">
                                        {/* Timeline line */}
                                        {idx < consultation.notes.length - 1 && (
                                            <div className="absolute left-[9px] top-4 w-px h-full bg-charcoal/10" />
                                        )}
                                        {/* Timeline dot */}
                                        <div className="absolute left-0 top-1 w-[18px] h-[18px] rounded-full bg-sage/40 border-2 border-white flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-moss" />
                                        </div>

                                        <div className="bg-stone rounded-xl p-4 relative">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User size={11} className="text-charcoal/30" />
                                                    <span className="text-[10px] font-sans font-bold text-charcoal/50 uppercase tracking-wider">{note.author}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-sans text-charcoal/30">{note.timestamp}</span>
                                                    <button
                                                        onClick={() => setDeleteNote(note)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-charcoal/20 hover:text-red-500 cursor-pointer"
                                                        title="Remove note"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm font-sans text-charcoal/70 leading-relaxed">{note.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add note */}
                        <div className="mt-4 space-y-3">
                            <textarea
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                                placeholder="Add a note..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors resize-none"
                            />
                            <button
                                onClick={handleAddNote}
                                disabled={!newNote.trim()}
                                className="flex items-center gap-2 bg-moss text-white px-5 py-2.5 rounded-xl text-sm font-sans font-semibold hover:bg-charcoal transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <Plus size={14} />
                                Add Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete note confirmation */}
            <ConfirmDialog
                isOpen={!!deleteNote}
                title="Remove Note"
                message="Are you sure you want to remove this note? This action cannot be undone."
                confirmLabel="Remove"
                variant="danger"
                onConfirm={handleDeleteNote}
                onCancel={() => setDeleteNote(null)}
            />

            {/* Status change confirmation */}
            <ConfirmDialog
                isOpen={!!confirmStatus}
                title={`Mark as ${confirmStatus}`}
                message={`Are you sure you want to mark this consultation as "${confirmStatus}"?`}
                confirmLabel={`Yes, mark as ${confirmStatus}`}
                variant={confirmStatus === 'cancelled' ? 'danger' : 'default'}
                onConfirm={handleStatusChange}
                onCancel={() => setConfirmStatus(null)}
            />

            <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
        </>
    );
};
