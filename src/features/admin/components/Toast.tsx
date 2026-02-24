import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

const ICONS: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={16} />,
    error: <AlertCircle size={16} />,
    info: <Info size={16} />,
};

const STYLES: Record<ToastType, string> = {
    success: 'bg-moss text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-charcoal text-white',
};

const ToastItem: React.FC<{ item: ToastItem; onDismiss: (id: string) => void }> = ({ item, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        // Animate in
        requestAnimationFrame(() => setIsVisible(true));
        // Auto dismiss
        timerRef.current = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(item.id), 300);
        }, 3000);
        return () => clearTimeout(timerRef.current);
    }, [item.id, onDismiss]);

    return (
        <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg font-sans text-sm font-medium transition-all duration-300 ${STYLES[item.type]} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
        >
            {ICONS[item.type]}
            <span className="flex-1">{item.message}</span>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onDismiss(item.id), 300);
                }}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const toast = useCallback((type: ToastType, message: string) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setToasts(prev => [...prev, { id, type, message }]);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            {/* Toast container */}
            <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto">
                        <ToastItem item={t} onDismiss={dismiss} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
