import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user exists
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
        if (existing) {
            throw new Error("A user with this email already exists");
        }

        const userId = await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            passwordHash: args.password, // In production, use a proper hash
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(args.name)}&background=2e4036&color=fff`,
            role: "client",
        });
        const user = await ctx.db.get(userId);
        return user;
    },
});

export const login = query({
    args: {
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!user) {
            throw new Error("Invalid email or password");
        }
        if (user.passwordHash !== args.password) {
            throw new Error("Invalid email or password");
        }
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
        };
    },
});

export const getUser = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        if (!user) return null;
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
        };
    },
});
