import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { rewriteStorageUrl } from "./storageUrlUtils";

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
