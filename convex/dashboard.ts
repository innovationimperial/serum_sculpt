import { query } from "./_generated/server";

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        const blogPosts = await ctx.db.query("blogPosts").collect();
        const consultations = await ctx.db.query("consultations").collect();
        const orders = await ctx.db.query("orders").collect();
        const programs = await ctx.db.query("programs").collect();

        const activeConsultations = consultations.filter(
            (c) => c.status === "confirmed" || c.status === "pending"
        ).length;

        const totalBlogViews = blogPosts.reduce((sum, b) => sum + b.views, 0);

        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

        // Build recent activity from the latest records
        const recentActivity = [
            ...orders.slice(-3).map((o) => ({
                id: o._id,
                type: "order" as const,
                message: `New order: ${o.items.map((i) => i.productName).join(", ")}`,
                timestamp: new Date(o._creationTime).toLocaleString(),
            })),
            ...consultations.slice(-3).map((c) => ({
                id: c._id,
                type: "booking" as const,
                message: `Booking: ${c.type} — ${c.clientName}`,
                timestamp: new Date(c._creationTime).toLocaleString(),
            })),
            ...blogPosts.slice(-2).map((b) => ({
                id: b._id,
                type: "blog" as const,
                message: `"${b.title}" — ${b.views.toLocaleString()} views`,
                timestamp: new Date(b._creationTime).toLocaleString(),
            })),
        ].slice(0, 5);

        return {
            stats: {
                totalRevenue,
                revenueChange: 12.4,
                activeConsultations,
                consultationsChange: 8.1,
                blogViews: totalBlogViews,
                blogViewsChange: -2.3,
                productOrders: orders.length,
                ordersChange: 15.7,
            },
            recentActivity,
            revenueTrend: [
                8200, 9400, 11200, 10800, 13500, 14100, 15200, 14700, 16800, 18200,
                17500, 19100,
            ],
            productCount: products.length,
            programCount: programs.length,
        };
    },
});
