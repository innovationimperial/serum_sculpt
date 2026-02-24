import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Category, Product } from '../types';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';

gsap.registerPlugin(ScrollTrigger);

const ProductModal = lazy(() => import('./ProductModal').then(m => ({ default: m.ProductModal })));

const STORE_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'House of Langa Selection',
        category: 'Skincare',
        price: 1250.00,
        desc: 'Elevate your routine with our curated selection of House of Langa. Premium cosmetics aligned with our rigorous clinical standards.',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1500&auto=format&fit=crop',
        clinicalGuidance: 'Ideal for mature skin types seeking deep hydration and barrier repair without heavy occlusion.',
        usage: 'Apply 2-3 drops morning and evening after cleansing.',
    },
    {
        id: '2',
        name: 'Hemp Recovery Concentrate',
        category: 'Hemp',
        price: 850.00,
        desc: "Potent, science-backed hemp formulations selected to soothe inflammation and support your skin's natural recovery process.",
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1500&auto=format&fit=crop',
        clinicalGuidance: 'Excellent for reactive or compromised skin. Helps manage redness and irritation.',
        usage: 'Use as a spot treatment or mix a drop with your daily moisturizer.',
    },
    {
        id: '3',
        name: 'Advanced Weight Wellness',
        category: 'Wellness',
        price: 2100.00,
        desc: 'Pharmacist-approved wellness and weight management solutions designed to safely and sustainably restore your vitality.',
        image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1500&auto=format&fit=crop',
        clinicalGuidance: 'Supports healthy metabolism without stimulants. Best used in conjunction with our clinical consultation.',
        usage: 'Take 1 scoop daily with water or your preferred non-dairy milk.',
    },
    {
        id: '4',
        name: 'Clinical Radiance Serum',
        category: 'Skincare',
        price: 1800.00,
        desc: 'A highly concentrated vitamin C serum stabilized to provide maximum antioxidant protection and brightening over time.',
        image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=1500&auto=format&fit=crop',
        clinicalGuidance: 'Essential for photo-damage defense and collagen support.',
        usage: 'Apply 4-5 drops in the morning before sunscreen.',
    },
    {
        id: '5',
        name: 'Sculpting Gua Sha Set',
        category: 'Tools',
        price: 450.00,
        desc: 'Clinical-grade rose quartz sculpting tools designed for lymphatic drainage and facial tension relief.',
        image: 'https://images.unsplash.com/photo-1643379855211-45b5a4ef44c4?q=80&w=1500&auto=format&fit=crop',
        clinicalGuidance: 'Improves microcirculation and enhances product absorption.',
        usage: 'Use 2-3 times a week with a facial oil for slip.',
    },
    {
        id: '6',
        name: 'Luminous Mineral Foundation',
        category: 'Makeup',
        price: 650.00,
        desc: 'Breathable, non-comedogenic coverage that protects while perfecting your complexion with a natural finish.',
        image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1500&auto=format&fit=crop',
        clinicalGuidance: 'Safe for post-procedure or acne-prone skin.',
        usage: 'Buff into skin using a dense brush for buildable coverage.',
    }
];

const CATEGORIES: Category[] = ['All', 'Skincare', 'Makeup', 'Wellness', 'Hemp', 'Tools'];

export const StoreSection: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredProducts = STORE_PRODUCTS.filter(
        product => activeCategory === 'All' || product.category === activeCategory
    );

    useEffect(() => {
        // Simple GSAP fade-in effect when filter changes
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
            );
        }
    }, [activeCategory]);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
    };

    return (
        <section id="skincare" className="w-full bg-[#E5E3DB] dark:bg-[#111111] py-24 px-8 border-t border-charcoal/10 dark:border-stone/10">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="text-center mb-16 max-w-2xl">
                    <h2 className="text-sm font-mono tracking-widest text-[#8a9a7a] uppercase mb-4 font-bold">Curated Clinical Skincare</h2>
                    <h3 className="font-serif italic text-4xl md:text-5xl text-charcoal dark:text-stone mb-6">Explore the Collection</h3>
                    <p className="font-sans text-charcoal/70 dark:text-stone/70 text-base leading-relaxed">
                        We stock select products that align with our clinical standards and skin philosophy. Filter below to discover targeted solutions.
                    </p>
                </div>

                <CategoryFilter
                    categories={CATEGORIES}
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                />

                <div
                    ref={containerRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full"
                >
                    {filteredProducts.map((product) => (
                        <div key={product.id}>
                            <ProductCard product={product} onClick={handleProductClick} />
                        </div>
                    ))}
                </div>
            </div>

            <Suspense fallback={null}>
                <ProductModal
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            </Suspense>
        </section>
    );
};
