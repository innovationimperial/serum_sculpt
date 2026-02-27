import React, { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { ChevronLeft, ChevronRight, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../features/store/context/CartContext';

const ProductPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const product = useQuery(api.products.get, id ? { id: id as Id<"products"> } : "skip");

    const images = product?.images && product.images.length > 0 ? product.images : [];
    const hasMultipleImages = images.length > 1;

    const goNext = useCallback(() => {
        if (images.length > 0) {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }
    }, [images.length]);

    const goPrev = useCallback(() => {
        if (images.length > 0) {
            setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
        }
    }, [images.length]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(() => {
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;
        if (Math.abs(diff) > threshold && images.length > 0) {
            if (diff > 0) {
                setCurrentImageIndex(prev => (prev + 1) % images.length);
            } else {
                setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
            }
        }
    }, [images.length]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product._id,
            name: product.name,
            store: product.store as 'All' | 'House of Langa' | 'Amway' | 'Hemp wellness' | 'Weight Wellness Store' | 'Serum & Sculpt Clinical Skincare',
            category: product.category as 'Skincare' | 'Makeup' | 'Wellness' | 'Hemp Range' | 'Tools',
            price: product.price,
            desc: product.description,
            images: product.images ?? [],
        }, quantity);
    };

    // Loading state
    if (product === undefined) {
        return (
            <div className="min-h-screen bg-stone dark:bg-[#111111] flex items-center justify-center">
                <div className="font-serif italic text-moss text-2xl animate-pulse">Loading product...</div>
            </div>
        );
    }

    // Product not found
    if (product === null) {
        return (
            <div className="min-h-screen bg-stone dark:bg-[#111111] flex flex-col items-center justify-center gap-6">
                <p className="font-serif italic text-charcoal/50 dark:text-stone/50 text-xl">Product not found</p>
                <button onClick={() => navigate('/shop')} className="text-moss underline font-sans text-sm">
                    Back to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone dark:bg-[#111111]">
            {/* Back link */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
                <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-charcoal/50 dark:text-stone/50 hover:text-moss transition-colors font-sans group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
                </Link>
            </div>

            {/* Main product layout */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

                    {/* Image carousel section */}
                    <div className="w-full lg:w-1/2">
                        <div
                            className="relative aspect-square rounded-3xl overflow-hidden bg-charcoal/5 dark:bg-white/5 border border-black/5 dark:border-white/5"
                            onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
                            onTouchMove={hasMultipleImages ? handleTouchMove : undefined}
                            onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
                        >
                            {images.length > 0 ? (
                                <div
                                    className="flex h-full transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                >
                                    {images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`${product.name} - Image ${i + 1}`}
                                            className="w-full h-full object-cover flex-shrink-0"
                                            style={{ minWidth: '100%' }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-charcoal/20 dark:text-stone/20">
                                    <p className="font-sans text-sm">No images available</p>
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {hasMultipleImages && (
                                <>
                                    <button
                                        onClick={goPrev}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full text-charcoal dark:text-stone hover:bg-white dark:hover:bg-black transition-all shadow-lg cursor-pointer"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={goNext}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full text-charcoal dark:text-stone hover:bg-white dark:hover:bg-black transition-all shadow-lg cursor-pointer"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                            {/* Image counter */}
                            {hasMultipleImages && (
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-xs font-mono rounded-full">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            )}
                        </div>

                        {/* Dot indicators */}
                        {hasMultipleImages && (
                            <div className="flex justify-center gap-2.5 mt-5">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${i === currentImageIndex
                                                ? 'bg-moss scale-110 shadow-md'
                                                : 'bg-charcoal/15 dark:bg-stone/15 hover:bg-charcoal/30 dark:hover:bg-stone/30'
                                            }`}
                                        aria-label={`Go to image ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Thumbnail strip */}
                        {hasMultipleImages && (
                            <div className="flex gap-3 mt-4">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${i === currentImageIndex
                                                ? 'ring-2 ring-moss ring-offset-2 ring-offset-stone dark:ring-offset-[#111111] scale-105'
                                                : 'opacity-50 hover:opacity-80'
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product details section */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        <div className="mb-2">
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-charcoal/40 dark:text-stone/40 font-bold">
                                {product.store}
                            </span>
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-moss mb-3 block font-bold">
                            {product.category}
                        </span>
                        <h1 className="font-serif italic text-4xl md:text-5xl text-charcoal dark:text-stone mb-4 leading-tight">
                            {product.name}
                        </h1>
                        <p className="font-sans text-2xl text-charcoal/80 dark:text-stone/80 tracking-widest mb-8 pb-8 border-b border-charcoal/10 dark:border-stone/10">
                            ZAR {product.price.toFixed(2)}
                        </p>

                        {/* Description */}
                        <div className="mb-8">
                            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#8a9a7a] mb-3">Description</h4>
                            <p className="font-sans font-light text-sm text-charcoal/70 dark:text-stone/70 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Clinical Guidance */}
                        {product.clinicalGuidance && (
                            <div className="bg-moss/10 dark:bg-moss/5 rounded-2xl p-6 border border-moss/20 mb-8">
                                <h4 className="flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-widest text-moss mb-3">
                                    <CheckCircle2 className="w-4 h-4" /> Clinical Guidance
                                </h4>
                                <p className="font-sans font-light text-sm text-charcoal/80 dark:text-stone/80 leading-relaxed">
                                    {product.clinicalGuidance}
                                </p>
                            </div>
                        )}

                        {/* Usage */}
                        {product.usage && (
                            <div className="mb-8">
                                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-charcoal/50 dark:text-stone/50 mb-3">Usage</h4>
                                <p className="font-sans font-light text-sm text-charcoal/70 dark:text-stone/70 leading-relaxed">
                                    {product.usage}
                                </p>
                            </div>
                        )}

                        {/* Ingredients */}
                        {product.ingredients && product.ingredients.length > 0 && (
                            <div className="mb-10">
                                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-charcoal/50 dark:text-stone/50 mb-3">Key Ingredients</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.ingredients.map((ingredient, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 rounded-full bg-charcoal/5 dark:bg-stone/5 text-xs font-sans font-medium text-charcoal/70 dark:text-stone/70 border border-charcoal/5 dark:border-stone/10"
                                        >
                                            {ingredient}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="mt-auto pt-8 border-t border-charcoal/10 dark:border-stone/10">
                            <div className="flex items-center gap-6 mb-6">
                                <span className="font-sans text-xs uppercase tracking-widest text-charcoal/50 dark:text-stone/50 font-bold">Qty</span>
                                <div className="flex items-center gap-3 bg-charcoal/5 dark:bg-stone/5 rounded-full px-4 py-2">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-charcoal/10 dark:hover:bg-stone/10 text-charcoal dark:text-stone transition-colors cursor-pointer text-lg font-bold"
                                    >
                                        −
                                    </button>
                                    <span className="font-mono text-sm w-8 text-center text-charcoal dark:text-stone">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-charcoal/10 dark:hover:bg-stone/10 text-charcoal dark:text-stone transition-colors cursor-pointer text-lg font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-4 rounded-full bg-charcoal text-stone dark:bg-stone dark:text-charcoal font-bold tracking-widest uppercase text-xs hover:bg-moss dark:hover:bg-moss dark:hover:text-stone transition-colors flex items-center justify-center gap-3 cursor-pointer"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Add to Cart — ZAR {(product.price * quantity).toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
