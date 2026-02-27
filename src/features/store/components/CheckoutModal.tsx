import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, ShieldCheck, CreditCard } from 'lucide-react';
import type { ShippingDetails } from '../types';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export const CheckoutModal: React.FC = () => {
    const { isCheckoutOpen, closeCheckout, items, cartTotal, clearCart } = useCart();
    const { requireAuth } = useRequireAuth();
    const createOrder = useMutation(api.orders.create);
    const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [form, setForm] = useState<ShippingDetails>({
        fullName: '',
        email: '',
        address: '',
        city: '',
        province: '',
        zipCode: '',
    });

    if (!isCheckoutOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleMockPayment = (e: React.FormEvent) => {
        e.preventDefault();
        requireAuth(async () => {
            setIsSimulatingPayment(true);
            try {
                await createOrder({
                    items: items.map(item => ({
                        productId: item.product.id as Id<"products">,
                        productName: item.product.name,
                        price: item.product.price,
                        quantity: item.quantity,
                    })),
                    shippingDetails: form,
                    total: cartTotal,
                });
            } catch (err) {
                console.error('Order creation failed:', err);
            }
            // Simulate a real PayFast redirect / modal delay
            setTimeout(() => {
                setIsSimulatingPayment(false);
                setIsSuccess(true);
                clearCart();
            }, 2000);
        });
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-charcoal/60 dark:bg-black/80 backdrop-blur-md" onClick={closeCheckout} />
                <div className="relative bg-stone dark:bg-[#1A1A1A] w-full max-w-md p-12 rounded-[2.5rem] shadow-2xl text-center space-y-6">
                    <div className="w-20 h-20 bg-moss/20 rounded-full flex items-center justify-center mx-auto text-moss">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h2 className="font-serif italic text-3xl text-charcoal dark:text-stone mb-2">Order Confirmed.</h2>
                    <p className="font-sans text-sm text-charcoal/70 dark:text-stone/70 leading-relaxed">
                        Thank you for your order. Your curated clinical products will be dispatched shortly. A confirmation email has been sent to {form.email}.
                    </p>
                    <button
                        onClick={closeCheckout}
                        className="mt-8 px-8 py-3 w-full rounded-full border border-charcoal text-charcoal dark:border-stone dark:text-stone font-sans tracking-wide uppercase text-xs hover:bg-charcoal hover:text-stone dark:hover:bg-stone dark:hover:text-charcoal transition-colors"
                    >
                        Return to Discovery
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-y-auto">
            <div className="fixed inset-0 bg-charcoal/60 dark:bg-black/80 backdrop-blur-md transition-opacity" onClick={closeCheckout} />

            <div className="relative bg-[#f8f7f5] dark:bg-[#161616] w-full max-w-5xl rounded-3xl md:rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto">
                <button
                    onClick={closeCheckout}
                    className="absolute top-6 right-6 z-20 p-2 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full text-charcoal dark:text-stone hover:bg-white dark:hover:bg-black transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left: Summary */}
                <div className="w-full md:w-[40%] bg-stone dark:bg-[#1A1A1A] p-8 md:p-12 border-r border-charcoal/5 dark:border-white/5">
                    <h2 className="font-serif italic text-3xl text-charcoal dark:text-stone mb-8">Order Summary</h2>
                    <div className="space-y-4 mb-8 flex-1 overflow-y-auto max-h-[40vh] md:max-h-full">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex gap-4 items-center">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-charcoal/5">
                                    {item.product.images?.[0] ? (
                                        <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-charcoal/20 text-[8px]">No img</div>
                                    )}
                                    <span className="absolute -top-2 -right-2 bg-charcoal text-stone text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-sans font-bold text-xs text-charcoal dark:text-stone line-clamp-1">{item.product.name}</p>
                                    <p className="font-sans text-xs text-charcoal/60 dark:text-stone/60">ZAR {item.product.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6 border-t border-charcoal/10 dark:border-stone/10">
                        <div className="flex justify-between items-center mb-2 font-sans text-sm text-charcoal/70 dark:text-stone/70">
                            <span>Subtotal</span>
                            <span>ZAR {cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 font-sans text-sm text-charcoal/70 dark:text-stone/70">
                            <span>Shipping</span>
                            <span>Calculated at next step</span>
                        </div>
                        <div className="flex justify-between items-center font-serif text-2xl text-charcoal dark:text-stone">
                            <span>Total</span>
                            <span>ZAR {cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Checkout Form */}
                <div className="w-full md:w-[60%] p-8 md:p-12 bg-[#f8f7f5] dark:bg-[#222222]">
                    <div className="mb-8">
                        <h2 className="font-serif italic text-3xl text-charcoal dark:text-stone mb-2">Shipping Details</h2>
                        <p className="font-sans text-sm text-charcoal/60 dark:text-stone/60">Enter your details to proceed to secure payment.</p>
                    </div>

                    <form onSubmit={handleMockPayment} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required name="fullName" placeholder="Full Name" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                            <input required type="email" name="email" placeholder="Email Address" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                        </div>
                        <input required name="address" placeholder="Shipping Address" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <input required name="city" placeholder="City" onChange={handleInputChange} className="col-span-1 md:col-span-1 px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                            <input required name="province" placeholder="Province / State" onChange={handleInputChange} className="col-span-1 md:col-span-1 px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                            <input required name="zipCode" placeholder="Postal Code" onChange={handleInputChange} className="col-span-2 md:col-span-1 px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isSimulatingPayment || items.length === 0}
                                className="magnetic-button w-full py-4 rounded-full bg-moss text-stone dark:bg-moss dark:text-stone font-bold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSimulatingPayment ? (
                                    <span className="animate-pulse">Processing...</span>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay ZAR {cartTotal.toFixed(2)} with PayFast (Mock)
                                    </>
                                )}
                            </button>
                            <p className="text-center mt-4 flex items-center justify-center gap-1.5 font-sans text-xs text-charcoal/40 dark:text-stone/40">
                                <ShieldCheck className="w-3.5 h-3.5" /> Secure checkout powered by PayFast.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
