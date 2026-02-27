import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const phaseValidator = v.object({
    name: v.string(),
    durationWeeks: v.number(),
    description: v.string(),
});

export const list = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.status) {
            return await ctx.db
                .query("programs")
                .withIndex("by_status", (q) =>
                    q.eq(
                        "status",
                        args.status as "active" | "draft" | "archived"
                    )
                )
                .collect();
        }
        return await ctx.db.query("programs").collect();
    },
});

export const get = query({
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        status: v.union(
            v.literal("active"),
            v.literal("draft"),
            v.literal("archived")
        ),
        phases: v.array(phaseValidator),
        outcomes: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("programs", {
            ...args,
            enrolledCount: 0,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("programs"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("active"),
                v.literal("draft"),
                v.literal("archived")
            )
        ),
        enrolledCount: v.optional(v.number()),
        phases: v.optional(v.array(phaseValidator)),
        outcomes: v.optional(v.array(v.string())),
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
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const toggleStatus = mutation({
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        const program = await ctx.db.get(args.id);
        if (!program) throw new Error("Program not found");
        const cycle: Record<string, "active" | "draft" | "archived"> = {
            active: "archived",
            draft: "active",
            archived: "draft",
        };
        await ctx.db.patch(args.id, {
            status: cycle[program.status] ?? "draft",
        });
    },
});
