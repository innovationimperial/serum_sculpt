import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { ProductCategory } from '../types';

const DEFAULT_CATEGORIES: ProductCategory[] = ['Skincare', 'Makeup', 'Wellness', 'Hemp Range', 'Tools'];

interface CategoryManagerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
    onCategoriesChange: (cats: string[]) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
    isOpen,
    onClose,
    categories,
    onCategoriesChange,
}) => {
    const [newCat, setNewCat] = useState('');
    const [error, setError] = useState('');

    const handleAdd = () => {
        const trimmed = newCat.trim();
        if (!trimmed) return;
        if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
            setError('Category already exists');
            return;
        }
        onCategoriesChange([...categories, trimmed]);
        setNewCat('');
        setError('');
    };

    const handleRemove = (cat: string) => {
        // Prevent removing if it's a default category
        if (DEFAULT_CATEGORIES.includes(cat as ProductCategory)) {
            setError(`"${cat}" is a default category and cannot be removed`);
            setTimeout(() => setError(''), 3000);
            return;
        }
        onCategoriesChange(categories.filter(c => c !== cat));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-[dialogIn_0.2s_ease-out]">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-serif italic text-xl text-charcoal">Manage Categories</h3>
                    <button onClick={onClose} className="p-1 text-charcoal/30 hover:text-charcoal transition-colors cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                {/* Category list */}
                <div className="space-y-2 mb-5 max-h-60 overflow-y-auto">
                    {categories.map(cat => (
                        <div key={cat} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone group">
                            <div className="flex items-center gap-2">
                                <span className="font-sans text-sm text-charcoal/80">{cat}</span>
                                {DEFAULT_CATEGORIES.includes(cat as ProductCategory) && (
                                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/20">default</span>
                                )}
                            </div>
                            <button
                                onClick={() => handleRemove(cat)}
                                className={`transition-all cursor-pointer ${DEFAULT_CATEGORIES.includes(cat as ProductCategory)
                                    ? 'text-charcoal/10 cursor-not-allowed'
                                    : 'text-charcoal/20 hover:text-red-500 opacity-0 group-hover:opacity-100'
                                    }`}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-xs font-sans mb-3">{error}</p>
                )}

                {/* Add new */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newCat}
                        onChange={e => { setNewCat(e.target.value); setError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        placeholder="New category name..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:border-moss/40 transition-colors"
                    />
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2.5 rounded-xl bg-moss text-white hover:bg-charcoal transition-colors cursor-pointer"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <style>{`
          @keyframes dialogIn {
            from { opacity: 0; transform: scale(0.95) translateY(8px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
            </div>
        </div>
    );
};
