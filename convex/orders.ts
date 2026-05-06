import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const PAYPAL_SUPPORTED_CURRENCIES = new Set([
    "AUD", "BRL", "CAD", "CZK", "DKK", "EUR", "HKD", "HUF", "ILS", "JPY",
    "MXN", "TWD", "NZD", "NOK", "PHP", "PLN", "GBP", "SGD", "SEK", "CHF",
    "THB", "USD",
]);

const ZERO_DECIMAL_PAYPAL_CURRENCIES = new Set(["HUF", "JPY", "TWD"]);

const cartItemInputValidator = v.object({
    productId: v.id("products"),
    quantity: v.number(),
});

const storedOrderItemValidator = v.object({
    productId: v.id("products"),
    productName: v.string(),
    price: v.number(),
    quantity: v.number(),
});

const shippingDetailsValidator = v.object({
    fullName: v.string(),
    email: v.string(),
    address: v.string(),
    city: v.string(),
    province: v.string(),
    zipCode: v.string(),
});

const payPalDetailsValidator = v.object({
    orderId: v.optional(v.string()),
    captureId: v.optional(v.string()),
    intent: v.optional(v.string()),
    status: v.optional(v.string()),
    payerId: v.optional(v.string()),
    payerEmail: v.optional(v.string()),
    payerGivenName: v.optional(v.string()),
    payerSurname: v.optional(v.string()),
    payerCountryCode: v.optional(v.string()),
    captureStatus: v.optional(v.string()),
    captureAmount: v.optional(v.number()),
    captureCurrency: v.optional(v.string()),
    grossAmount: v.optional(v.number()),
    paypalFee: v.optional(v.number()),
    netAmount: v.optional(v.number()),
    sellerProtectionStatus: v.optional(v.string()),
    sellerProtectionDisputeCategories: v.optional(v.array(v.string())),
    invoiceId: v.optional(v.string()),
    customId: v.optional(v.string()),
    merchantId: v.optional(v.string()),
    merchantEmail: v.optional(v.string()),
    createTime: v.optional(v.string()),
    updateTime: v.optional(v.string()),
});

const paystackDetailsValidator = v.object({
    transactionId: v.optional(v.number()),
    domain: v.optional(v.string()),
    amount: v.optional(v.number()),
    requestedAmount: v.optional(v.number()),
    channel: v.optional(v.string()),
    message: v.optional(v.string()),
    fees: v.optional(v.number()),
    paidAt: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    transactionDate: v.optional(v.string()),
    gatewayResponse: v.optional(v.string()),
    cardType: v.optional(v.string()),
    cardLast4: v.optional(v.string()),
    cardBank: v.optional(v.string()),
    cardCountryCode: v.optional(v.string()),
    cardBin: v.optional(v.string()),
    cardBrand: v.optional(v.string()),
    expMonth: v.optional(v.string()),
    expYear: v.optional(v.string()),
    signature: v.optional(v.string()),
    reusable: v.optional(v.boolean()),
    accountName: v.optional(v.string()),
    authorization: v.optional(v.string()),
    customerId: v.optional(v.number()),
    customerCode: v.optional(v.string()),
    customerFirstName: v.optional(v.string()),
    customerLastName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerRiskAction: v.optional(v.string()),
    customerInternationalPhone: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    logStartTime: v.optional(v.number()),
    logTimeSpent: v.optional(v.number()),
    logAttempts: v.optional(v.number()),
    logErrors: v.optional(v.number()),
    logSuccess: v.optional(v.boolean()),
    logMobile: v.optional(v.boolean()),
    history: v.optional(v.array(v.object({
        type: v.string(),
        message: v.string(),
        time: v.number(),
    }))),
});

type StoredPayPalDetails = {
    orderId?: string;
    captureId?: string;
    intent?: string;
    status?: string;
    payerId?: string;
    payerEmail?: string;
    payerGivenName?: string;
    payerSurname?: string;
    payerCountryCode?: string;
    captureStatus?: string;
    captureAmount?: number;
    captureCurrency?: string;
    grossAmount?: number;
    paypalFee?: number;
    netAmount?: number;
    sellerProtectionStatus?: string;
    sellerProtectionDisputeCategories?: string[];
    invoiceId?: string;
    customId?: string;
    merchantId?: string;
    merchantEmail?: string;
    createTime?: string;
    updateTime?: string;
};

type PayPalMoney = {
    currency_code?: string;
    value?: string;
};

type PayPalSellerProtection = {
    status?: string;
    dispute_categories?: string[];
};

type PayPalCapture = {
    id?: string;
    status?: string;
    amount?: PayPalMoney;
    seller_receivable_breakdown?: {
        gross_amount?: PayPalMoney;
        paypal_fee?: PayPalMoney;
        net_amount?: PayPalMoney;
    };
    seller_protection?: PayPalSellerProtection;
    create_time?: string;
    update_time?: string;
};

type PayPalCreateOrderResponse = {
    id?: string;
    status?: string;
    message?: string;
    details?: Array<{
        issue?: string;
        description?: string;
    }>;
};

type PayPalCaptureResponse = {
    id?: string;
    intent?: string;
    status?: string;
    payer?: {
        payer_id?: string;
        email_address?: string;
        name?: {
            given_name?: string;
            surname?: string;
        };
        address?: {
            country_code?: string;
        };
    };
    purchase_units?: Array<{
        invoice_id?: string;
        custom_id?: string;
        payee?: {
            merchant_id?: string;
            email_address?: string;
        };
        payments?: {
            captures?: PayPalCapture[];
        };
    }>;
    message?: string;
    details?: Array<{
        issue?: string;
        description?: string;
    }>;
};

type ProductSnapshot = {
    _id: Id<"products">;
    name: string;
    price: number;
    status: "active" | "hidden" | "out_of_stock";
};

type VerifiedCartItem = {
    productId: Id<"products">;
    productName: string;
    price: number;
    quantity: number;
};

function getEnv(name: string): string {
    const value = (globalThis as typeof globalThis & {
        process?: { env?: Record<string, string | undefined> };
    }).process?.env?.[name];

    if (!value) {
        throw new Error(`${name} is not configured`);
    }

    return value;
}

function getOptionalEnv(name: string): string | undefined {
    return (globalThis as typeof globalThis & {
        process?: { env?: Record<string, string | undefined> };
    }).process?.env?.[name];
}

function encodeBasicAuth(username: string, password: string): string {
    const buffer = (globalThis as typeof globalThis & {
        Buffer?: {
            from: (value: string) => { toString: (encoding: string) => string };
        };
    }).Buffer;

    if (buffer) {
        return buffer.from(`${username}:${password}`).toString("base64");
    }

    if (typeof btoa === "function") {
        return btoa(`${username}:${password}`);
    }

    throw new Error("Unable to encode PayPal credentials for OAuth");
}

function getStoreCurrency(): string {
    return (getOptionalEnv("PAYPAL_STORE_CURRENCY") ?? "ZAR").toUpperCase();
}

function getCheckoutCurrency(): string {
    return (getOptionalEnv("PAYPAL_CHECKOUT_CURRENCY") ?? "USD").toUpperCase();
}

function getPayPalBaseUrl(): string {
    return getOptionalEnv("PAYPAL_API_BASE_URL") ?? "https://api-m.sandbox.paypal.com";
}

function getShippingCountryCode(): string {
    return (getOptionalEnv("PAYPAL_SHIPPING_COUNTRY_CODE") ?? "ZA").toUpperCase();
}

function assertSupportedPayPalCurrency(currency: string) {
    if (!PAYPAL_SUPPORTED_CURRENCIES.has(currency)) {
        throw new Error(
            `PayPal does not support ${currency} for this checkout flow. Configure PAYPAL_CHECKOUT_CURRENCY to one of: ${Array.from(PAYPAL_SUPPORTED_CURRENCIES).join(", ")}.`
        );
    }
}

function roundCurrencyAmount(amount: number, currency: string): number {
    if (ZERO_DECIMAL_PAYPAL_CURRENCIES.has(currency)) {
        return Math.round(amount);
    }
    return Math.round(amount * 100) / 100;
}

function formatPayPalAmount(amount: number, currency: string): string {
    if (ZERO_DECIMAL_PAYPAL_CURRENCIES.has(currency)) {
        return `${Math.round(amount)}`;
    }
    return roundCurrencyAmount(amount, currency).toFixed(2);
}

function parsePayPalAmount(amount?: PayPalMoney): number | undefined {
    if (!amount?.value) return undefined;
    const parsed = Number.parseFloat(amount.value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function buildPayPalError(prefix: string, payload?: { message?: string; details?: Array<{ issue?: string; description?: string }> }): Error {
    const detail = payload?.details?.find((entry) => entry.description || entry.issue);
    const message = detail?.description ?? detail?.issue ?? payload?.message ?? "Unknown PayPal error";
    return new Error(`${prefix}: ${message}`);
}

async function getPayPalAccessToken(): Promise<string> {
    const clientId = getEnv("PAYPAL_CLIENT_ID");
    const clientSecret = getEnv("PAYPAL_CLIENT_SECRET");
    const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${encodeBasicAuth(clientId, clientSecret)}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    const result = await response.json() as { access_token?: string; message?: string };
    if (!response.ok || !result.access_token) {
        throw new Error(`PayPal authentication failed: ${result.message ?? response.statusText}`);
    }

    return result.access_token;
}

async function resolveExchangeRate(storeCurrency: string, checkoutCurrency: string): Promise<number> {
    if (storeCurrency === checkoutCurrency) {
        return 1;
    }

    const manualRate = getOptionalEnv("PAYPAL_MANUAL_EXCHANGE_RATE");
    if (manualRate) {
        const parsed = Number.parseFloat(manualRate);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            throw new Error("PAYPAL_MANUAL_EXCHANGE_RATE must be a positive number");
        }
        return parsed;
    }

    const fxResponse = await fetch(
        `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(storeCurrency)}&symbols=${encodeURIComponent(checkoutCurrency)}`
    );

    const fxPayload = await fxResponse.json() as {
        rates?: Record<string, number>;
        message?: string;
    };

    const rate = fxPayload.rates?.[checkoutCurrency];
    if (!fxResponse.ok || !Number.isFinite(rate) || !rate || rate <= 0) {
        throw new Error(
            `Unable to resolve a ${storeCurrency} -> ${checkoutCurrency} exchange rate. Set PAYPAL_MANUAL_EXCHANGE_RATE to continue.`
        );
    }

    return rate;
}

async function verifyCartItems(
    ctx: {
        runQuery: (...args: any[]) => Promise<unknown>;
    },
    items: Array<{ productId: Id<"products">; quantity: number }>
): Promise<{ items: VerifiedCartItem[]; total: number }> {
    if (items.length === 0) {
        throw new Error("The cart is empty");
    }

    const verifiedItems = await Promise.all(
        items.map(async (item) => {
            if (item.quantity <= 0) {
                throw new Error("Each cart item must have a quantity greater than zero");
            }

            const product = await ctx.runQuery(api.products.get, { id: item.productId }) as ProductSnapshot | null;
            if (!product) {
                throw new Error("One or more products in the cart no longer exist");
            }
            if (product.status !== "active") {
                throw new Error(`${product.name} is no longer available for checkout`);
            }

            return {
                productId: product._id,
                productName: product.name,
                price: product.price,
                quantity: item.quantity,
            };
        })
    );

    return {
        items: verifiedItems,
        total: verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
}

function buildPayPalLineItems(items: VerifiedCartItem[], exchangeRate: number, checkoutCurrency: string) {
    const lineItems = items.map((item) => {
        const convertedUnitAmount = roundCurrencyAmount(item.price * exchangeRate, checkoutCurrency);
        return {
            name: item.productName,
            quantity: String(item.quantity),
            unit_amount: {
                currency_code: checkoutCurrency,
                value: formatPayPalAmount(convertedUnitAmount, checkoutCurrency),
            },
            category: "PHYSICAL_GOODS" as const,
        };
    });

    const orderAmount = lineItems.reduce((sum, item, index) => {
        const quantity = items[index]?.quantity ?? 0;
        const unitAmount = Number.parseFloat(item.unit_amount.value);
        return sum + (Number.isFinite(unitAmount) ? unitAmount * quantity : 0);
    }, 0);

    return {
        lineItems,
        orderAmount: roundCurrencyAmount(orderAmount, checkoutCurrency),
    };
}

export const create = mutation({
    args: {
        userId: v.optional(v.id("users")),
        items: v.array(storedOrderItemValidator),
        shippingDetails: shippingDetailsValidator,
        total: v.number(),
        paymentMethod: v.optional(v.string()),
        paymentStatus: v.optional(v.union(
            v.literal("paid"),
            v.literal("failed"),
            v.literal("refunded"),
            v.literal("partially_refunded")
        )),
        paymentReference: v.optional(v.string()),
        currency: v.optional(v.string()),
        paymentAmount: v.optional(v.number()),
        paymentCurrency: v.optional(v.string()),
        exchangeRateUsed: v.optional(v.number()),
        payPalDetails: v.optional(payPalDetailsValidator),
        paystackDetails: v.optional(paystackDetailsValidator),
    },
    handler: async (ctx, args) => {
        if (args.paymentReference) {
            const existing = await ctx.db
                .query("orders")
                .withIndex("by_paymentReference", (q) => q.eq("paymentReference", args.paymentReference as string))
                .first();

            if (existing) {
                return existing._id;
            }
        }

        return await ctx.db.insert("orders", {
            userId: args.userId,
            items: args.items.map((item) => ({ ...item, discount: 0 })),
            shippingDetails: args.shippingDetails,
            total: args.total,
            status: "pending",
            paymentMethod: args.paymentMethod ?? "paypal",
            paymentStatus: args.paymentStatus ?? "paid",
            paymentReference: args.paymentReference ?? "",
            payPalDetails: args.payPalDetails,
            paystackDetails: args.paystackDetails,
            discountCode: "",
            discountAmount: 0,
            shippingCost: 0,
            tax: args.total * 0.15,
            currency: args.currency ?? getStoreCurrency(),
            paymentAmount: args.paymentAmount,
            paymentCurrency: args.paymentCurrency,
            exchangeRateUsed: args.exchangeRateUsed,
        });
    },
});

export const createPayPalOrder = action({
    args: {
        items: v.array(cartItemInputValidator),
        shippingDetails: shippingDetailsValidator,
    },
    handler: async (ctx, args) => {
        const storeCurrency = getStoreCurrency();
        const checkoutCurrency = getCheckoutCurrency();
        assertSupportedPayPalCurrency(checkoutCurrency);

        const { items, total } = await verifyCartItems(ctx, args.items);
        const exchangeRateUsed = await resolveExchangeRate(storeCurrency, checkoutCurrency);
        const { lineItems, orderAmount } = buildPayPalLineItems(items, exchangeRateUsed, checkoutCurrency);
        const accessToken = await getPayPalAccessToken();
        const invoiceId = `SS-${Date.now()}`;

        const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "PayPal-Request-Id": invoiceId,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        invoice_id: invoiceId,
                        custom_id: args.shippingDetails.email,
                        description: "Serum and Sculpt store checkout",
                        amount: {
                            currency_code: checkoutCurrency,
                            value: formatPayPalAmount(orderAmount, checkoutCurrency),
                            breakdown: {
                                item_total: {
                                    currency_code: checkoutCurrency,
                                    value: formatPayPalAmount(orderAmount, checkoutCurrency),
                                },
                            },
                        },
                        items: lineItems,
                        shipping: {
                            name: {
                                full_name: args.shippingDetails.fullName,
                            },
                            address: {
                                address_line_1: args.shippingDetails.address,
                                admin_area_2: args.shippingDetails.city,
                                admin_area_1: args.shippingDetails.province,
                                postal_code: args.shippingDetails.zipCode,
                                country_code: getShippingCountryCode(),
                            },
                        },
                    },
                ],
                application_context: {
                    brand_name: "Serum and Sculpt",
                    shipping_preference: "SET_PROVIDED_ADDRESS",
                    user_action: "PAY_NOW",
                },
            }),
        });

        const result = await response.json() as PayPalCreateOrderResponse;
        if (!response.ok || !result.id) {
            throw buildPayPalError("Unable to create the PayPal order", result);
        }

        return {
            orderId: result.id,
            paymentAmount: orderAmount,
            paymentCurrency: checkoutCurrency,
            storeCurrency,
            storeTotal: total,
            exchangeRateUsed: storeCurrency === checkoutCurrency ? undefined : exchangeRateUsed,
        };
    },
});

export const capturePayPalOrder = action({
    args: {
        orderId: v.string(),
        items: v.array(cartItemInputValidator),
        shippingDetails: shippingDetailsValidator,
    },
    handler: async (ctx, args): Promise<{
        orderId: Id<"orders">;
        payPalDetails: StoredPayPalDetails;
        paymentAmount?: number;
        paymentCurrency?: string;
    }> => {
        const { items, total } = await verifyCartItems(ctx, args.items);
        const accessToken = await getPayPalAccessToken();

        const response = await fetch(
            `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(args.orderId)}/capture`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const result = await response.json() as PayPalCaptureResponse;
        if (!response.ok || result.status !== "COMPLETED") {
            throw buildPayPalError("Unable to capture the PayPal payment", result);
        }

        const purchaseUnit = result.purchase_units?.[0];
        const capture = purchaseUnit?.payments?.captures?.[0];
        if (!capture?.id) {
            throw new Error("PayPal capture completed without a capture ID");
        }

        const paymentAmount = parsePayPalAmount(capture.amount);
        const paymentCurrency = capture.amount?.currency_code;
        const payPalDetails: StoredPayPalDetails = {
            orderId: result.id ?? args.orderId,
            captureId: capture.id,
            intent: result.intent,
            status: result.status,
            payerId: result.payer?.payer_id,
            payerEmail: result.payer?.email_address,
            payerGivenName: result.payer?.name?.given_name,
            payerSurname: result.payer?.name?.surname,
            payerCountryCode: result.payer?.address?.country_code,
            captureStatus: capture.status,
            captureAmount: paymentAmount,
            captureCurrency: paymentCurrency,
            grossAmount: parsePayPalAmount(capture.seller_receivable_breakdown?.gross_amount),
            paypalFee: parsePayPalAmount(capture.seller_receivable_breakdown?.paypal_fee),
            netAmount: parsePayPalAmount(capture.seller_receivable_breakdown?.net_amount),
            sellerProtectionStatus: capture.seller_protection?.status,
            sellerProtectionDisputeCategories: capture.seller_protection?.dispute_categories,
            invoiceId: purchaseUnit?.invoice_id,
            customId: purchaseUnit?.custom_id,
            merchantId: purchaseUnit?.payee?.merchant_id,
            merchantEmail: purchaseUnit?.payee?.email_address,
            createTime: capture.create_time,
            updateTime: capture.update_time,
        };

        const orderId = await ctx.runMutation(api.orders.create, {
            items,
            shippingDetails: args.shippingDetails,
            total,
            paymentMethod: "paypal",
            paymentStatus: "paid",
            paymentReference: capture.id,
            currency: getStoreCurrency(),
            paymentAmount,
            paymentCurrency,
            exchangeRateUsed: paymentAmount && total ? paymentAmount / total : undefined,
            payPalDetails,
        });

        return {
            orderId,
            payPalDetails,
            paymentAmount,
            paymentCurrency,
        };
    },
});

// ─── List all orders (desc) ──────────────────────────────────
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("orders").order("desc").collect();
    },
});

// ─── List orders joined with user data ───────────────────────
export const listWithUsers = query({
    args: {},
    handler: async (ctx) => {
        const orders = await ctx.db.query("orders").order("desc").collect();
        const enriched = await Promise.all(
            orders.map(async (order) => {
                let user = null;
                if (order.userId) {
                    user = await ctx.db.get(order.userId);
                }
                return {
                    ...order,
                    customerName: user?.name ?? order.shippingDetails.fullName,
                    customerEmail: user?.email ?? order.shippingDetails.email,
                    customerPhone: user?.phone ?? "",
                    customerType: user?.customerType ?? "registered",
                };
            })
        );
        return enriched;
    },
});

// ─── Get single order by ID ──────────────────────────────────
export const getById = query({
    args: { id: v.id("orders") },
    handler: async (ctx, { id }) => {
        const order = await ctx.db.get(id);
        if (!order) return null;
        let user = null;
        if (order.userId) {
            user = await ctx.db.get(order.userId);
        }
        return {
            ...order,
            customerName: user?.name ?? order.shippingDetails.fullName,
            customerEmail: user?.email ?? order.shippingDetails.email,
            customerPhone: user?.phone ?? "",
            customerCountry: user?.country ?? "South Africa",
            customerType: user?.customerType ?? "registered",
            accountCreatedAt: user?._creationTime ?? null,
        };
    },
});

// ─── Update order status ─────────────────────────────────────
export const updateStatus = mutation({
    args: {
        id: v.id("orders"),
        status: v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("shipped"),
            v.literal("delivered"),
            v.literal("cancelled"),
            v.literal("refunded")
        ),
    },
    handler: async (ctx, { id, status }) => {
        await ctx.db.patch(id, { status });
    },
});

// ─── Customer stats (aggregated per customer) ────────────────
export const getCustomerStats = query({
    args: {},
    handler: async (ctx) => {
        const orders = await ctx.db.query("orders").collect();
        const users = await ctx.db.query("users").collect();

        const customerMap = new Map<
            string,
            {
                userId: string;
                name: string;
                email: string;
                phone: string;
                billingAddress: string;
                shippingAddress: string;
                country: string;
                customerType: string;
                accountCreatedAt: number;
                totalOrders: number;
                ltv: number;
                lastOrderDate: number;
            }
        >();

        // Seed from users table
        for (const user of users) {
            if (user.role === "admin") continue;
            customerMap.set(user._id, {
                userId: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone ?? "",
                billingAddress: user.billingAddress ?? "",
                shippingAddress: user.shippingAddress ?? "",
                country: user.country ?? "South Africa",
                customerType: user.customerType ?? "registered",
                accountCreatedAt: user._creationTime,
                totalOrders: 0,
                ltv: 0,
                lastOrderDate: 0,
            });
        }

        // Aggregate orders
        for (const order of orders) {
            const key = order.userId ?? `guest-${order.shippingDetails.email}`;
            const existing = customerMap.get(key as string);
            if (existing) {
                existing.totalOrders += 1;
                existing.ltv += order.total;
                if (order._creationTime > existing.lastOrderDate) {
                    existing.lastOrderDate = order._creationTime;
                }
            } else {
                customerMap.set(key as string, {
                    userId: key as string,
                    name: order.shippingDetails.fullName,
                    email: order.shippingDetails.email,
                    phone: "",
                    billingAddress: order.shippingDetails.address,
                    shippingAddress: order.shippingDetails.address,
                    country: "South Africa",
                    customerType: "guest",
                    accountCreatedAt: order._creationTime,
                    totalOrders: 1,
                    ltv: order.total,
                    lastOrderDate: order._creationTime,
                });
            }
        }

        return Array.from(customerMap.values()).map((c) => ({
            ...c,
            aov: c.totalOrders > 0 ? c.ltv / c.totalOrders : 0,
        }));
    },
});

// ─── Revenue & operational metrics ───────────────────────────
export const getRevenueMetrics = query({
    args: {},
    handler: async (ctx) => {
        const orders = await ctx.db.query("orders").collect();

        let grossRevenue = 0;
        let totalDiscounts = 0;
        let totalTax = 0;
        let totalShipping = 0;
        let refundedTotal = 0;
        let cancelledCount = 0;
        let refundedCount = 0;
        let failedPayments = 0;

        for (const order of orders) {
            grossRevenue += order.total;
            totalDiscounts += order.discountAmount ?? 0;
            totalTax += order.tax ?? 0;
            totalShipping += order.shippingCost ?? 0;

            if (order.status === "refunded") {
                refundedTotal += order.total;
                refundedCount += 1;
            }
            if (order.status === "cancelled") {
                cancelledCount += 1;
            }
            if (order.paymentStatus === "failed") {
                failedPayments += 1;
            }
        }

        const totalOrders = orders.length;

        return {
            grossRevenue,
            netRevenue: grossRevenue - refundedTotal,
            totalDiscounts,
            totalTax,
            totalShipping,
            refundRate: totalOrders > 0 ? (refundedCount / totalOrders) * 100 : 0,
            cancelRate: totalOrders > 0 ? (cancelledCount / totalOrders) * 100 : 0,
            paymentFailureRate: totalOrders > 0 ? (failedPayments / totalOrders) * 100 : 0,
            totalOrders,
            refundedCount,
            cancelledCount,
            failedPayments,
        };
    },
});
