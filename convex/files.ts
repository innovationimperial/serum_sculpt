import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate an upload URL for the client to upload a file directly to Convex storage
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

// Resolve a storage ID to a serving URL (called after upload)
export const getImageUrl = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});
