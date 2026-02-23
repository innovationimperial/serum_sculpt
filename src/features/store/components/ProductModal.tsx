import React from 'react';
import type { Product } from '../types';
import { X, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
    const { addItem } = useCart();

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        addItem(product, 1);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-charcoal/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative bg-stone dark:bg-[#1A1A1A] w-full max-w-4xl rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row transform transition-all"
                role="dialog"
                aria-modal="true"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 bg-stone/50 dark:bg-black/50 backdrop-blur-md rounded-full text-charcoal dark:text-stone hover:bg-stone dark:hover:bg-black transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-charcoal/5 dark:bg-white/5">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                    <div className="mb-6">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-60 mb-3 block text-charcoal dark:text-stone/60">
                            {product.category}
                        </span>
                        <h2 className="font-serif italic text-3xl md:text-4xl mb-4 text-charcoal dark:text-stone">
                            {product.name}
                        </h2>
                        <p className="font-sans text-xl text-charcoal/80 dark:text-stone/80 tracking-widest mb-6 border-b border-charcoal/10 dark:border-stone/10 pb-6">
                            ZAR {product.price.toFixed(2)}
                        </p>
                    </div>

                    <div className="flex-grow space-y-6 overflow-y-auto mb-8 pr-2">
                        <div>
                            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#8a9a7a] mb-2">Description</h4>
                            <p className="font-sans font-light text-sm text-charcoal/70 dark:text-stone/70 leading-relaxed">
                                {product.desc}
                            </p>
                        </div>

                        {product.clinicalGuidance && (
                            <div className="bg-moss/10 dark:bg-moss/5 rounded-2xl p-5 border border-moss/20">
                                <h4 className="flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-widest text-moss mb-3">
                                    <CheckCircle2 className="w-4 h-4" /> Clinical Guidance
                                </h4>
                                <p className="font-sans font-light text-sm text-charcoal/80 dark:text-stone/80 leading-relaxed">
                                    {product.clinicalGuidance}
                                </p>
                            </div>
                        )}

                        {product.usage && (
                            <div>
                                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-charcoal/50 dark:text-stone/50 mb-2">Usage</h4>
                                <p className="font-sans font-light text-sm text-charcoal/70 dark:text-stone/70 leading-relaxed">
                                    {product.usage}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full py-4 rounded-full bg-charcoal text-stone dark:bg-stone dark:text-charcoal font-bold tracking-widest uppercase text-xs hover:bg-moss dark:hover:bg-moss dark:hover:text-stone transition-colors"
                    >
                        Add to Cart &mdash; ZAR {product.price.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
};
