import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAction } from 'convex/react';
import { X, ShieldCheck, CreditCard, ChevronLeft, Lock } from 'lucide-react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';
import { rewriteStorageUrl } from '../../../lib/rewriteStorageUrl';
import { useCart } from '../context/CartContext';
import type { ShippingDetails } from '../types';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
const STORE_CURRENCY = (import.meta.env.VITE_STORE_CURRENCY as string | undefined) ?? 'ZAR';
const PAYPAL_CHECKOUT_CURRENCY = (import.meta.env.VITE_PAYPAL_CHECKOUT_CURRENCY as string | undefined) ?? 'USD';

let paypalSdkPromise: Promise<void> | null = null;

function loadPayPalSdk(clientId: string, currency: string): Promise<void> {
    if (window.paypal) {
        return Promise.resolve();
    }

    if (paypalSdkPromise) {
        return paypalSdkPromise;
    }

    paypalSdkPromise = new Promise((resolve, reject) => {
        const existingScript = document.querySelector('script[data-paypal-sdk="true"]') as HTMLScriptElement | null;

        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(), { once: true });
            existingScript.addEventListener('error', () => reject(new Error('Unable to load the PayPal SDK.')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=capture&commit=true&components=buttons`;
        script.async = true;
        script.setAttribute('data-paypal-sdk', 'true');
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Unable to load the PayPal SDK.'));
        document.head.appendChild(script);
    });

    return paypalSdkPromise;
}

function formatCurrency(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat('en', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${currency} ${amount.toFixed(2)}`;
    }
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return 'Something went wrong while processing the PayPal checkout.';
}

type PayPalQuote = {
    paymentAmount: number;
    paymentCurrency: string;
    exchangeRateUsed?: number;
};

export const CheckoutModal: React.FC = () => {
    const { isCheckoutOpen, closeCheckout, items, cartTotal, clearCart } = useCart();
    const createPayPalOrder = useAction(api.orders.createPayPalOrder);
    const capturePayPalOrder = useAction(api.orders.capturePayPalOrder);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPaymentStepActive, setIsPaymentStepActive] = useState(false);
    const [isPayPalReady, setIsPayPalReady] = useState(false);
    const [isLoadingSdk, setIsLoadingSdk] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [paypalQuote, setPaypalQuote] = useState<PayPalQuote | null>(null);
    const [form, setForm] = useState<ShippingDetails>({
        fullName: '',
        email: '',
        address: '',
        city: '',
        province: '',
        zipCode: '',
    });

    const paypalButtonsRef = useRef<HTMLDivElement | null>(null);

    const cartPayload = useMemo(
        () => items.map((item) => ({
            productId: item.product.id as Id<'products'>,
            quantity: item.quantity,
        })),
        [items]
    );

    const resetCheckoutState = () => {
        setIsProcessing(false);
        setIsSuccess(false);
        setIsPaymentStepActive(false);
        setErrorMessage(null);
        setPaypalQuote(null);
        setForm({
            fullName: '',
            email: '',
            address: '',
            city: '',
            province: '',
            zipCode: '',
        });
    };

    const handleClose = () => {
        resetCheckoutState();
        closeCheckout();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const isFormValid = () => {
        return (
            form.fullName.trim() !== '' &&
            form.email.trim() !== '' &&
            form.address.trim() !== '' &&
            form.city.trim() !== '' &&
            form.province.trim() !== '' &&
            form.zipCode.trim() !== ''
        );
    };

    useEffect(() => {
        if (!isCheckoutOpen || !PAYPAL_CLIENT_ID) {
            return;
        }

        setIsLoadingSdk(true);
        setErrorMessage(null);

        loadPayPalSdk(PAYPAL_CLIENT_ID, PAYPAL_CHECKOUT_CURRENCY)
            .then(() => {
                setIsPayPalReady(true);
                setIsLoadingSdk(false);
            })
            .catch((error: unknown) => {
                setErrorMessage(getErrorMessage(error));
                setIsLoadingSdk(false);
            });
    }, [isCheckoutOpen]);

    useEffect(() => {
        if (!isCheckoutOpen || !isPaymentStepActive || !isPayPalReady || !paypalButtonsRef.current || !window.paypal) {
            return;
        }

        const container = paypalButtonsRef.current;
        container.innerHTML = '';

        const buttons = window.paypal.Buttons({
            style: {
                layout: 'vertical',
                shape: 'pill',
                label: 'paypal',
            },
            createOrder: async () => {
                setErrorMessage(null);
                setIsProcessing(true);

                try {
                    const response = await createPayPalOrder({
                        items: cartPayload,
                        shippingDetails: form,
                    });

                    setPaypalQuote({
                        paymentAmount: response.paymentAmount,
                        paymentCurrency: response.paymentCurrency,
                        exchangeRateUsed: response.exchangeRateUsed,
                    });

                    return response.orderId;
                } catch (error: unknown) {
                    const message = getErrorMessage(error);
                    setErrorMessage(message);
                    setIsProcessing(false);
                    throw error;
                }
            },
            onApprove: async (data, actions) => {
                if (!data.orderID) {
                    setErrorMessage('PayPal returned an approval without an order ID.');
                    setIsProcessing(false);
                    return;
                }

                try {
                    await capturePayPalOrder({
                        orderId: data.orderID,
                        items: cartPayload,
                        shippingDetails: form,
                    });

                    clearCart();
                    setIsSuccess(true);
                    setIsPaymentStepActive(false);
                    setIsProcessing(false);
                } catch (error: unknown) {
                    const message = getErrorMessage(error);

                    if (message.includes('INSTRUMENT_DECLINED') && actions.restart) {
                        setIsProcessing(false);
                        await actions.restart();
                        return;
                    }

                    setErrorMessage(message);
                    setIsProcessing(false);
                }
            },
            onCancel: () => {
                setIsProcessing(false);
                setErrorMessage('PayPal checkout was cancelled before payment was completed.');
            },
            onError: (error: unknown) => {
                setErrorMessage(getErrorMessage(error));
                setIsProcessing(false);
            },
        });

        if (!buttons.isEligible()) {
            setErrorMessage('PayPal is not available on this device or browser.');
            return;
        }

        void buttons.render(container).catch((error: unknown) => {
            setErrorMessage(getErrorMessage(error));
        });

        return () => {
            if (buttons.close) {
                void buttons.close();
            }
            container.innerHTML = '';
        };
    }, [capturePayPalOrder, cartPayload, clearCart, createPayPalOrder, form, isCheckoutOpen, isPayPalReady, isPaymentStepActive]);

    if (!isCheckoutOpen) {
        return null;
    }

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-charcoal/60 dark:bg-black/80 backdrop-blur-md" onClick={handleClose} />
                <div className="relative bg-stone dark:bg-[#1A1A1A] w-full max-w-md p-12 rounded-[2.5rem] shadow-2xl text-center space-y-6">
                    <div className="w-20 h-20 bg-moss/20 rounded-full flex items-center justify-center mx-auto text-moss">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h2 className="font-serif italic text-3xl text-charcoal dark:text-stone mb-2">Order Confirmed.</h2>
                    <p className="font-sans text-sm text-charcoal/70 dark:text-stone/70 leading-relaxed">
                        Your PayPal payment has been captured and your order is now recorded against {form.email}.
                    </p>
                    <button
                        onClick={handleClose}
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
            <div className="fixed inset-0 bg-charcoal/60 dark:bg-black/80 backdrop-blur-md transition-opacity" onClick={handleClose} />

            <div className="relative bg-[#f8f7f5] dark:bg-[#161616] w-full max-w-5xl rounded-3xl md:rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row my-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-20 p-2 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full text-charcoal dark:text-stone hover:bg-white dark:hover:bg-black transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="w-full md:w-[40%] bg-stone dark:bg-[#1A1A1A] p-8 md:p-12 border-r border-charcoal/5 dark:border-white/5">
                    <h2 className="font-serif italic text-3xl text-charcoal dark:text-stone mb-8">Order Summary</h2>
                    <div className="space-y-4 mb-8 flex-1 overflow-y-auto max-h-[40vh] md:max-h-full">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex gap-4 items-center">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-charcoal/5">
                                    {item.product.images?.[0] ? (
                                        <img src={rewriteStorageUrl(item.product.images[0])} className="w-full h-full object-cover" alt={item.product.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-charcoal/20 text-[8px]">No img</div>
                                    )}
                                    <span className="absolute -top-2 -right-2 bg-charcoal text-stone text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-sans font-bold text-xs text-charcoal dark:text-stone line-clamp-1">{item.product.name}</p>
                                    <p className="font-sans text-xs text-charcoal/60 dark:text-stone/60">{formatCurrency(item.product.price, STORE_CURRENCY)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6 border-t border-charcoal/10 dark:border-stone/10 space-y-2">
                        <div className="flex justify-between items-center font-sans text-sm text-charcoal/70 dark:text-stone/70">
                            <span>Subtotal</span>
                            <span>{formatCurrency(cartTotal, STORE_CURRENCY)}</span>
                        </div>
                        <div className="flex justify-between items-center font-sans text-sm text-charcoal/70 dark:text-stone/70">
                            <span>Shipping</span>
                            <span>Calculated in store total</span>
                        </div>
                        <div className="flex justify-between items-center font-serif text-2xl text-charcoal dark:text-stone pt-2">
                            <span>Total</span>
                            <span>{formatCurrency(cartTotal, STORE_CURRENCY)}</span>
                        </div>
                        {paypalQuote && (
                            <div className="pt-4 border-t border-charcoal/10 dark:border-stone/10">
                                <div className="flex justify-between items-center font-sans text-sm text-charcoal/70 dark:text-stone/70">
                                    <span>PayPal charge</span>
                                    <span>{formatCurrency(paypalQuote.paymentAmount, paypalQuote.paymentCurrency)}</span>
                                </div>
                                {paypalQuote.exchangeRateUsed && (
                                    <p className="mt-2 text-[11px] font-sans text-charcoal/45 dark:text-stone/45">
                                        Exchange rate applied at checkout: 1 {STORE_CURRENCY} = {paypalQuote.exchangeRateUsed.toFixed(4)} {paypalQuote.paymentCurrency}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-[60%] p-8 md:p-12 bg-[#f8f7f5] dark:bg-[#222222]">
                    <div className="mb-8">
                        <h2 className="font-serif italic text-3xl text-charcoal dark:text-stone mb-2">
                            {isPaymentStepActive ? 'Pay with PayPal' : 'Shipping Details'}
                        </h2>
                        <p className="font-sans text-sm text-charcoal/60 dark:text-stone/60">
                            {isPaymentStepActive
                                ? 'Review the payment step below and complete the order with PayPal.'
                                : 'Enter your delivery details before you proceed to PayPal.'}
                        </p>
                    </div>

                    {!isPaymentStepActive ? (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (!isFormValid() || items.length === 0) {
                                    return;
                                }

                                setErrorMessage(null);
                                setIsPaymentStepActive(true);
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required name="fullName" value={form.fullName} placeholder="Full Name" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                                <input required type="email" name="email" value={form.email} placeholder="Email Address" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                            </div>
                            <input required name="address" value={form.address} placeholder="Shipping Address" onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <input required name="city" value={form.city} placeholder="City" onChange={handleInputChange} className="col-span-1 md:col-span-1 px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                                <input required name="province" value={form.province} placeholder="Province / State" onChange={handleInputChange} className="col-span-1 md:col-span-1 px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                                <input required name="zipCode" value={form.zipCode} placeholder="Postal Code" onChange={handleInputChange} className="col-span-2 md:col-span-1 px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-charcoal/10 dark:border-white/20 font-sans text-sm text-charcoal dark:text-stone placeholder:text-charcoal/40 dark:placeholder:text-stone/50 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss/30" />
                            </div>

                            <div className="rounded-2xl border border-charcoal/10 dark:border-white/10 bg-white/70 dark:bg-black/20 p-4">
                                <div className="flex items-start gap-3">
                                    <Lock className="w-4 h-4 mt-0.5 text-moss" />
                                    <div className="space-y-1">
                                        <p className="font-sans text-sm font-semibold text-charcoal dark:text-stone">PayPal will handle the payment step.</p>
                                        <p className="font-sans text-xs text-charcoal/60 dark:text-stone/60">
                                            Store prices are shown in {STORE_CURRENCY}. PayPal will finalize the payment in {PAYPAL_CHECKOUT_CURRENCY}{STORE_CURRENCY !== PAYPAL_CHECKOUT_CURRENCY ? ' using the checkout exchange rate.' : '.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={items.length === 0}
                                    className="magnetic-button w-full py-4 rounded-full bg-moss text-stone dark:bg-moss dark:text-stone font-bold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Continue to PayPal
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-charcoal/10 dark:border-white/10 bg-white/70 dark:bg-black/20 p-5 space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-sans text-sm font-semibold text-charcoal dark:text-stone">{form.fullName}</p>
                                        <p className="font-sans text-xs text-charcoal/60 dark:text-stone/60">{form.email}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPaymentStepActive(false);
                                            setErrorMessage(null);
                                            setPaypalQuote(null);
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-charcoal/10 dark:border-white/10 text-xs font-sans font-semibold text-charcoal/70 dark:text-stone/70 hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Edit details
                                    </button>
                                </div>
                                <p className="font-sans text-sm text-charcoal/70 dark:text-stone/70">
                                    {form.address}, {form.city}, {form.province} {form.zipCode}
                                </p>
                                <p className="font-sans text-xs text-charcoal/50 dark:text-stone/50">
                                    Your catalog total is {formatCurrency(cartTotal, STORE_CURRENCY)}. PayPal will authorize and capture the final amount in {PAYPAL_CHECKOUT_CURRENCY}.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-charcoal/10 dark:border-white/10 bg-white dark:bg-white/5 p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck className="w-4 h-4 text-moss" />
                                    <p className="font-sans text-sm font-semibold text-charcoal dark:text-stone">Secure PayPal checkout</p>
                                </div>
                                <p className="font-sans text-xs text-charcoal/55 dark:text-stone/55 mb-4">
                                    PayPal creates the order on the server, then captures it after approval so your order and payment stay in sync with Convex.
                                </p>
                                {isLoadingSdk && (
                                    <p className="font-sans text-sm text-charcoal/60 dark:text-stone/60 animate-pulse">
                                        Loading PayPal checkout...
                                    </p>
                                )}
                                <div ref={paypalButtonsRef} className="min-h-[48px]" />
                            </div>
                        </div>
                    )}

                    <div className="pt-6">
                        <p className="text-center flex items-center justify-center gap-1.5 font-sans text-xs text-charcoal/40 dark:text-stone/40">
                            <ShieldCheck className="w-3.5 h-3.5" /> Secure checkout powered by PayPal.
                        </p>
                        {isProcessing && (
                            <p className="mt-3 text-center text-sm text-charcoal/60 dark:text-stone/60 animate-pulse font-sans">
                                Processing your PayPal checkout...
                            </p>
                        )}
                        {errorMessage && (
                            <p className="mt-3 text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl font-sans">
                                {errorMessage}
                            </p>
                        )}
                        {!PAYPAL_CLIENT_ID && (
                            <p className="mt-3 text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl font-sans">
                                VITE_PAYPAL_CLIENT_ID is not configured, so checkout cannot start.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
