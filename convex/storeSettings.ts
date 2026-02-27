import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("storeSettings").collect();
        return all[0] ?? null;
    },
});

export const update = mutation({
    args: {
        heroImage: v.optional(v.string()),
        tagline: v.optional(v.string()),
        description: v.optional(v.string()),
        announcementBanner: v.optional(v.string()),
        partnerBrands: v.optional(
            v.array(
                v.object({
                    id: v.string(),
                    name: v.string(),
                    logoUrl: v.string(),
                })
            )
        ),
    },
    handler: async (ctx, args) => {
        const all = await ctx.db.query("storeSettings").collect();
        const existing = all[0];

        const updates: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(args)) {
            if (value !== undefined) {
                updates[key] = value;
            }
        }

        if (existing) {
            await ctx.db.patch(existing._id, updates);
        } else {
            await ctx.db.insert("storeSettings", {
                heroImage: args.heroImage ?? "",
                tagline: args.tagline ?? "",
                description: args.description ?? "",
                announcementBanner: args.announcementBanner ?? "",
                partnerBrands: args.partnerBrands ?? [],
            });
        }
    },
});
