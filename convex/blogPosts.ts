import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.status) {
            return await ctx.db
                .query("blogPosts")
                .withIndex("by_status", (q) =>
                    q.eq("status", args.status as "published" | "draft")
                )
                .collect();
        }
        return await ctx.db.query("blogPosts").collect();
    },
});

export const get = query({
    args: { id: v.id("blogPosts") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        category: v.string(),
        excerpt: v.string(),
        content: v.string(),
        featuredImage: v.string(),
        tags: v.array(v.string()),
        status: v.union(v.literal("published"), v.literal("draft")),
        publishedDate: v.string(),
        readTimeMin: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("blogPosts", {
            ...args,
            views: 0,
            engagement: 0,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("blogPosts"),
        title: v.optional(v.string()),
        category: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        content: v.optional(v.string()),
        featuredImage: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        status: v.optional(v.union(v.literal("published"), v.literal("draft"))),
        publishedDate: v.optional(v.string()),
        readTimeMin: v.optional(v.number()),
        views: v.optional(v.number()),
        engagement: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
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
    args: { id: v.id("blogPosts") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
