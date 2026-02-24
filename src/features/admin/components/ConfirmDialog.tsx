import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    onConfirm,
    onCancel,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Keyboard: Escape to close
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onCancel]);

    // Focus trap
    useEffect(() => {
        if (isOpen) dialogRef.current?.focus();
    }, [isOpen]);

    if (!isOpen) return null;

    const isDanger = variant === 'danger';

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div
                ref={dialogRef}
                tabIndex={-1}
                className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-[dialogIn_0.2s_ease-out]"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-message"
            >
                <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isDanger ? 'bg-red-50 text-red-600' : 'bg-sage/40 text-moss'
                        }`}>
                        {isDanger ? <Trash2 size={20} /> : <AlertTriangle size={20} />}
                    </div>
                    <div>
                        <h3 id="confirm-title" className="font-serif italic text-xl text-charcoal mb-2">{title}</h3>
                        <p id="confirm-message" className="font-sans text-sm text-charcoal/60 leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-charcoal/10 text-sm font-sans font-medium text-charcoal/60 hover:border-charcoal/20 transition-colors cursor-pointer"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-xl text-sm font-sans font-semibold transition-colors cursor-pointer ${isDanger
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-moss text-white hover:bg-charcoal'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
};
