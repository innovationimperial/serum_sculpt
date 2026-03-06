import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

type PaystackVerificationResponse = {
    status: boolean;
    message?: string;
    data?: {
        id?: number;
        domain?: string;
        status?: string;
        reference?: string;
        amount?: number;
        requested_amount?: number;
        message?: string | null;
        gateway_response?: string;
        paid_at?: string;
        created_at?: string;
        transaction_date?: string;
        channel?: string;
        currency?: string;
        ip_address?: string | null;
        fees?: number | null;
        authorization?: {
            authorization_code?: string;
            bin?: string;
            last4?: string;
            exp_month?: string;
            exp_year?: string;
            channel?: string;
            card_type?: string;
            bank?: string;
            country_code?: string;
            brand?: string;
            reusable?: boolean;
            signature?: string;
            account_name?: string | null;
        } | null;
        customer?: {
            id?: number;
            first_name?: string | null;
            last_name?: string | null;
            email?: string;
            customer_code?: string;
            phone?: string | null;
            risk_action?: string;
            international_format_phone?: string | null;
        } | null;
        log?: {
            start_time?: number;
            time_spent?: number;
            attempts?: number;
            errors?: number;
            success?: boolean;
            mobile?: boolean;
            history?: Array<{
                type?: string;
                message?: string;
                time?: number;
            }>;
        } | null;
    };
};

type StoredPaystackDetails = {
    transactionId?: number;
    domain?: string;
    amount?: number;
    requestedAmount?: number;
    channel?: string;
    message?: string;
    fees?: number;
    paidAt?: string;
    createdAt?: string;
    transactionDate?: string;
    gatewayResponse?: string;
    cardType?: string;
    cardLast4?: string;
    cardBank?: string;
    cardCountryCode?: string;
    cardBin?: string;
    cardBrand?: string;
    expMonth?: string;
    expYear?: string;
    signature?: string;
    reusable?: boolean;
    accountName?: string;
    authorization?: string;
    customerId?: number;
    customerCode?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerRiskAction?: string;
    customerInternationalPhone?: string;
    ipAddress?: string;
    logStartTime?: number;
    logTimeSpent?: number;
    logAttempts?: number;
    logErrors?: number;
    logSuccess?: boolean;
    logMobile?: boolean;
    history?: Array<{
        type: string;
        message: string;
        time: number;
    }>;
};

// ─── Create order (existing, unchanged) ─────────────────────
export const create = mutation({
    args: {
        userId: v.optional(v.id("users")),
        items: v.array(
            v.object({
                productId: v.id("products"),
                productName: v.string(),
                price: v.number(),
                quantity: v.number(),
            })
        ),
        shippingDetails: v.object({
            fullName: v.string(),
            email: v.string(),
            address: v.string(),
            city: v.string(),
            province: v.string(),
            zipCode: v.string(),
        }),
        total: v.number(),
        paymentReference: v.optional(v.string()),
        paystackDetails: v.optional(v.object({
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
        })),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("orders", {
            ...args,
            items: args.items.map((i) => ({ ...i, discount: 0 })),
            status: "pending",
            paymentMethod: "paystack",
            paymentStatus: "paid",
            paymentReference: args.paymentReference ?? "",
            paystackDetails: args.paystackDetails,
            discountCode: "",
            discountAmount: 0,
            shippingCost: 0,
            tax: args.total * 0.15,
            currency: "ZAR",
        });
    },
});

// ─── Verify Paystack transaction & create order ─────────────
export const verifyAndCreateOrder = action({
    args: {
        reference: v.string(),
        items: v.array(
            v.object({
                productId: v.id("products"),
                productName: v.string(),
                price: v.number(),
                quantity: v.number(),
            })
        ),
        shippingDetails: v.object({
            fullName: v.string(),
            email: v.string(),
            address: v.string(),
            city: v.string(),
            province: v.string(),
            zipCode: v.string(),
        }),
        total: v.number(),
    },
    handler: async (ctx, args): Promise<{ orderId: Id<"orders">; paystackDetails: StoredPaystackDetails }> => {
        // 1. Verify the transaction with Paystack API
        const secretKey = (globalThis as typeof globalThis & {
            process?: { env?: Record<string, string | undefined> };
        }).process?.env?.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            throw new Error("PAYSTACK_SECRET_KEY not configured");
        }

        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${encodeURIComponent(args.reference)}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const result = await response.json() as PaystackVerificationResponse;

        if (!result.status || result.data?.status !== "success") {
            throw new Error(
                `Payment verification failed: ${result.message || "Transaction not successful"}`
            );
        }

        const txn = result.data;
        if (!txn) {
            throw new Error("Payment verification failed: missing transaction data");
        }

        // 2. Extract detailed Paystack data
        const paystackDetails: StoredPaystackDetails = {
            transactionId: txn.id ?? undefined,
            domain: txn.domain ?? undefined,
            amount: txn.amount != null ? txn.amount / 100 : undefined,
            requestedAmount: txn.requested_amount != null ? txn.requested_amount / 100 : undefined,
            channel: txn.channel ?? undefined,
            message: txn.message ?? undefined,
            fees: txn.fees != null ? txn.fees / 100 : undefined,
            paidAt: txn.paid_at ?? undefined,
            createdAt: txn.created_at ?? undefined,
            transactionDate: txn.transaction_date ?? undefined,
            gatewayResponse: txn.gateway_response ?? undefined,
            cardType: txn.authorization?.card_type ?? undefined,
            cardLast4: txn.authorization?.last4 ?? undefined,
            cardBank: txn.authorization?.bank ?? undefined,
            cardCountryCode: txn.authorization?.country_code ?? undefined,
            cardBin: txn.authorization?.bin ?? undefined,
            cardBrand: txn.authorization?.brand ?? undefined,
            expMonth: txn.authorization?.exp_month ?? undefined,
            expYear: txn.authorization?.exp_year ?? undefined,
            signature: txn.authorization?.signature ?? undefined,
            reusable: txn.authorization?.reusable ?? undefined,
            accountName: txn.authorization?.account_name ?? undefined,
            authorization: txn.authorization?.authorization_code ?? undefined,
            customerId: txn.customer?.id ?? undefined,
            customerCode: txn.customer?.customer_code ?? undefined,
            customerFirstName: txn.customer?.first_name ?? undefined,
            customerLastName: txn.customer?.last_name ?? undefined,
            customerEmail: txn.customer?.email ?? undefined,
            customerPhone: txn.customer?.phone ?? undefined,
            customerRiskAction: txn.customer?.risk_action ?? undefined,
            customerInternationalPhone: txn.customer?.international_format_phone ?? undefined,
            ipAddress: txn.ip_address ?? undefined,
            logStartTime: txn.log?.start_time ?? undefined,
            logTimeSpent: txn.log?.time_spent ?? undefined,
            logAttempts: txn.log?.attempts ?? undefined,
            logErrors: txn.log?.errors ?? undefined,
            logSuccess: txn.log?.success ?? undefined,
            logMobile: txn.log?.mobile ?? undefined,
            history: txn.log?.history
                ?.filter((entry) => entry.type && entry.message && entry.time != null)
                .map((entry) => ({
                    type: entry.type as string,
                    message: entry.message as string,
                    time: entry.time as number,
                })) ?? undefined,
        };

        // 3. Create the order via mutation
        const orderId: Id<"orders"> = await ctx.runMutation(api.orders.create, {
            items: args.items,
            shippingDetails: args.shippingDetails,
            total: args.total,
            paymentReference: args.reference,
            paystackDetails,
        });

        return { orderId, paystackDetails };
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
