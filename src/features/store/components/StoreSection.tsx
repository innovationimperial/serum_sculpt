import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StoreName, Product, Category } from '../types';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

gsap.registerPlugin(ScrollTrigger);

const STORES: StoreName[] = ['All', 'House of Langa', 'Amway', 'Hemp wellness', 'Weight Wellness Store', 'Serum & Sculpt Clinical Skincare'];

export const StoreSection: React.FC = () => {
    const [activeStore, setActiveStore] = useState<StoreName>('All');
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch active products from the database
    const dbProducts = useQuery(api.products.list, { status: "active" });

    // Map DB products to the Product type the components expect
    const products: Product[] = (dbProducts ?? []).map(p => ({
        id: p._id,
        name: p.name,
        store: p.store as StoreName,
        category: p.category as Category,
        price: p.price,
        desc: p.description,
        images: p.images ?? [],
        clinicalGuidance: p.clinicalGuidance,
        usage: p.usage,
    }));

    const filteredProducts = products.filter(
        product => activeStore === 'All' || product.store === activeStore
    );

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
            );
        }
    }, [activeStore, dbProducts]);

    return (
        <section id="skincare" className="w-full bg-[#E5E3DB] dark:bg-[#111111] py-24 px-8 border-t border-charcoal/10 dark:border-stone/10">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="text-center mb-16 max-w-2xl">
                    <h2 className="text-sm font-mono tracking-widest text-[#8a9a7a] uppercase mb-4 font-bold">Featured Stores</h2>
                    <h3 className="font-serif italic text-4xl md:text-5xl text-charcoal dark:text-stone mb-6">Browse the collection of featured stores</h3>
                    <p className="font-sans text-charcoal/70 dark:text-stone/70 text-base leading-relaxed">
                        Filter below to discover targeted solutions from our clinical partners.
                    </p>
                </div>

                <CategoryFilter
                    categories={STORES as unknown as import('../types').Category[]}
                    activeCategory={activeStore as unknown as import('../types').Category}
                    onSelectCategory={(s) => setActiveStore(s as unknown as StoreName)}
                />

                {!dbProducts ? (
                    <div className="flex items-center justify-center h-40 w-full">
                        <div className="font-serif italic text-charcoal/40 dark:text-stone/40 text-lg animate-pulse">Loading products...</div>
                    </div>
                ) : (
                    <div
                        ref={containerRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full"
                    >
                        {filteredProducts.map((product) => (
                            <div key={product.id}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
