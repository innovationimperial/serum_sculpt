import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const noteValidator = v.object({
    id: v.string(),
    text: v.string(),
    timestamp: v.string(),
    author: v.string(),
});

export const list = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.status) {
            return await ctx.db
                .query("consultations")
                .withIndex("by_status", (q) =>
                    q.eq(
                        "status",
                        args.status as
                        | "confirmed"
                        | "pending"
                        | "completed"
                        | "cancelled"
                    )
                )
                .collect();
        }
        return await ctx.db.query("consultations").collect();
    },
});

export const get = query({
    args: { id: v.id("consultations") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        clientName: v.string(),
        clientEmail: v.string(),
        clientPhone: v.string(),
        date: v.string(),
        time: v.string(),
        type: v.string(),
        status: v.union(
            v.literal("confirmed"),
            v.literal("pending"),
            v.literal("completed"),
            v.literal("cancelled")
        ),
        preConsultationNotes: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("consultations", {
            ...args,
            notes: [],
        });
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("consultations"),
        status: v.union(
            v.literal("confirmed"),
            v.literal("pending"),
            v.literal("completed"),
            v.literal("cancelled")
        ),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});

export const addNote = mutation({
    args: {
        id: v.id("consultations"),
        note: noteValidator,
    },
    handler: async (ctx, args) => {
        const consultation = await ctx.db.get(args.id);
        if (!consultation) throw new Error("Consultation not found");
        await ctx.db.patch(args.id, {
            notes: [...consultation.notes, args.note],
        });
    },
});

export const updateNotes = mutation({
    args: {
        id: v.id("consultations"),
        notes: v.array(noteValidator),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { notes: args.notes });
    },
});
