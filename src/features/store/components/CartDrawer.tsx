import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { rewriteStorageUrl } from '../../../lib/rewriteStorageUrl';

export const CartDrawer: React.FC = () => {
    const { items, isCartOpen, closeCart, updateQuantity, removeItem, openCheckout, cartTotal } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-charcoal/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className="relative w-full max-w-md h-full bg-stone dark:bg-[#1A1A1A] shadow-2xl flex flex-col transform transition-transform"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-charcoal/10 dark:border-stone/10 bg-stone dark:bg-[#1A1A1A] z-10">
                    <h2 className="flex items-center gap-3 font-serif italic text-2xl text-charcoal dark:text-stone">
                        <ShoppingBag className="w-5 h-5 text-moss" />
                        Your Bag
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 rounded-full text-charcoal/50 hover:bg-charcoal/5 dark:text-stone/50 dark:hover:bg-stone/5 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-charcoal/50 dark:text-stone/50">
                            <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
                            <p className="font-sans text-sm tracking-widest uppercase">Your bag is empty.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.product.id} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5">
                                {item.product.images?.[0] ? (
                                    <img
                                        src={rewriteStorageUrl(item.product.images[0])}
                                        alt={item.product.name}
                                        className="w-20 h-24 object-cover rounded-xl bg-charcoal/5"
                                    />
                                ) : (
                                    <div className="w-20 h-24 rounded-xl bg-charcoal/5 flex items-center justify-center text-charcoal/20 text-[10px]">No img</div>
                                )}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-sans font-bold text-sm text-charcoal dark:text-stone line-clamp-1">
                                            {item.product.name}
                                        </h3>
                                        <span className="font-mono text-[10px] uppercase opacity-60 text-charcoal dark:text-stone">
                                            {item.product.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3 bg-charcoal/5 dark:bg-black/30 rounded-full px-2 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="p-1 text-charcoal/60 hover:text-charcoal dark:text-stone/60 dark:hover:text-stone"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="font-mono text-xs w-4 text-center text-charcoal dark:text-stone">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="p-1 text-charcoal/60 hover:text-charcoal dark:text-stone/60 dark:hover:text-stone"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-sans font-bold text-sm text-charcoal dark:text-stone">
                                            ZAR {(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem(item.product.id)}
                                    className="text-charcoal/30 hover:text-red-500 dark:text-stone/30 dark:hover:text-red-400 transition-colors self-start p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-charcoal/10 dark:border-stone/10 bg-white dark:bg-[#1A1A1A]">
                        <div className="flex items-center justify-between mb-6">
                            <span className="font-sans text-sm text-charcoal/70 dark:text-stone/70">Subtotal</span>
                            <span className="font-serif italic text-2xl text-charcoal dark:text-stone">
                                ZAR {cartTotal.toFixed(2)}
                            </span>
                        </div>
                        <button
                            onClick={openCheckout}
                            className="magnetic-button w-full py-4 rounded-full bg-moss text-stone dark:bg-moss dark:text-stone font-bold tracking-widest uppercase text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
