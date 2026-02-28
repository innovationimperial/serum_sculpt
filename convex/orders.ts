import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("orders", {
            ...args,
            items: args.items.map((i) => ({ ...i, discount: 0 })),
            status: "pending",
            paymentMethod: "card",
            paymentStatus: "paid",
            discountCode: "",
            discountAmount: 0,
            shippingCost: 0,
            tax: args.total * 0.15,
            currency: "ZAR",
        });
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
