import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        fullName: v.string(),
        email: v.string(),
        purpose: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("contactInquiries", args);
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("contactInquiries").order("desc").collect();
    },
});
