import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
            status: "pending",
        });
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("orders").order("desc").collect();
    },
});
