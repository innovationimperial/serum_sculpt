import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { rewriteStorageUrl } from "./storageUrlUtils";

export const list = query({
    args: {
        store: v.optional(v.string()),
        category: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let products;
        if (args.store) {
            products = await ctx.db
                .query("products")
                .withIndex("by_store", (q) => q.eq("store", args.store!))
                .collect();
        } else if (args.category) {
            products = await ctx.db
                .query("products")
                .withIndex("by_category", (q) => q.eq("category", args.category!))
                .collect();
        } else if (args.status) {
            products = await ctx.db
                .query("products")
                .withIndex("by_status", (q) =>
                    q.eq("status", args.status as "active" | "hidden" | "out_of_stock")
                )
                .collect();
        } else {
            products = await ctx.db.query("products").collect();
        }
        return products;
    },
});

export const get = query({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Generate an upload URL for the client to upload a file directly to Convex storage
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        const url = await ctx.storage.generateUploadUrl();
        return rewriteStorageUrl(url);
    },
});

// Resolve a storage ID to a serving URL (called after upload)
export const getImageUrl = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        const url = await ctx.storage.getUrl(args.storageId);
        return url ? rewriteStorageUrl(url) : null;
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        store: v.string(),
        category: v.string(),
        price: v.number(),
        description: v.string(),
        images: v.array(v.string()),
        clinicalGuidance: v.string(),
        usage: v.string(),
        ingredients: v.array(v.string()),
        status: v.union(
            v.literal("active"),
            v.literal("hidden"),
            v.literal("out_of_stock")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("products", {
            ...args,
            views: 0,
            addToCartCount: 0,
            conversionRate: 0,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        name: v.optional(v.string()),
        store: v.optional(v.string()),
        category: v.optional(v.string()),
        price: v.optional(v.number()),
        description: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        clinicalGuidance: v.optional(v.string()),
        usage: v.optional(v.string()),
        ingredients: v.optional(v.array(v.string())),
        status: v.optional(
            v.union(
                v.literal("active"),
                v.literal("hidden"),
                v.literal("out_of_stock")
            )
        ),
        views: v.optional(v.number()),
        addToCartCount: v.optional(v.number()),
        conversionRate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        // Remove undefined fields
        const updates: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(fields)) {
            if (value !== undefined) {
                updates[key] = value;
            }
        }
        await ctx.db.patch(id, updates);
    },
});

export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const toggleStatus = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        const product = await ctx.db.get(args.id);
        if (!product) throw new Error("Product not found");
        const cycle: Record<string, "active" | "hidden" | "out_of_stock"> = {
            active: "hidden",
            hidden: "out_of_stock",
            out_of_stock: "active",
        };
        await ctx.db.patch(args.id, {
            status: cycle[product.status] ?? "active",
        });
    },
});
