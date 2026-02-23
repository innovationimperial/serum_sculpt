import React, { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import type { Product, CartItem } from '../types';

interface CartContextType {
    items: CartItem[];
    isCartOpen: boolean;
    isCheckoutOpen: boolean;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    openCheckout: () => void;
    closeCheckout: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const addItem = useCallback((product: Product, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
        setIsCartOpen(true); // Auto open cart on add
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        setItems((prev) => {
            if (quantity <= 0) {
                return prev.filter((item) => item.product.id !== productId);
            }
            return prev.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            );
        });
    }, []);

    const clearCart = useCallback(() => setItems([]), []);
    const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);
    const openCheckout = useCallback(() => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    }, []);
    const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

    const cartTotal = useMemo(() => {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }, [items]);

    const cartCount = useMemo(() => {
        return items.reduce((count, item) => count + item.quantity, 0);
    }, [items]);

    const value = useMemo(
        () => ({
            items,
            isCartOpen,
            isCheckoutOpen,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            toggleCart,
            openCart,
            closeCart,
            openCheckout,
            closeCheckout,
            cartTotal,
            cartCount,
        }),
        [
            items,
            isCartOpen,
            isCheckoutOpen,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            toggleCart,
            openCart,
            closeCart,
            openCheckout,
            closeCheckout,
            cartTotal,
            cartCount,
        ]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
