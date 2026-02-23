import React from 'react';
import type { Product } from '../types';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    return (
        <div
            className="group cursor-pointer flex flex-col items-start text-left"
            onClick={() => onClick(product)}
        >
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-charcoal/5 dark:bg-stone/5 border border-black/5 dark:border-white/5">
                <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            <div className="w-full flex-grow flex flex-col justify-between">
                <div>
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-60 mb-3 block text-charcoal dark:text-stone">
                        {product.category}
                    </span>
                    <h3 className="font-serif italic text-2xl md:text-3xl mb-3 text-charcoal dark:text-stone transition-colors group-hover:text-moss dark:group-hover:text-[#d9e2d5]">
                        {product.name}
                    </h3>
                    <p className="font-sans font-light text-sm opacity-80 leading-relaxed mb-6 text-charcoal dark:text-stone/80 line-clamp-2">
                        {product.desc}
                    </p>
                </div>


                <div className="w-full flex items-center justify-between mt-auto">
                    <span className="font-sans text-sm tracking-widest text-charcoal dark:text-stone">
                        ZAR {product.price.toFixed(2)}
                    </span>
                    <button
                        className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-charcoal/60 group-hover:text-moss dark:text-stone/60 dark:group-hover:text-[#d9e2d5] transition-colors"
                        aria-label={`Explore ${product.name}`}
                    >
                        Explore <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};
