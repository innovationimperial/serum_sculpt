import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // ─── Users ────────────────────────────────────────────────────
    users: defineTable({
        name: v.string(),
        email: v.string(),
        passwordHash: v.string(),
        avatar: v.string(),
        role: v.union(v.literal("admin"), v.literal("client")),
        // Customer Intelligence fields (optional for backwards compat)
        phone: v.optional(v.string()),
        billingAddress: v.optional(v.string()),
        shippingAddress: v.optional(v.string()),
        country: v.optional(v.string()),
        customerType: v.optional(
            v.union(
                v.literal("guest"),
                v.literal("registered"),
                v.literal("wholesale"),
                v.literal("vip")
            )
        ),
    }).index("by_email", ["email"]),

    // ─── Products ─────────────────────────────────────────────────
    products: defineTable({
        name: v.string(),
        store: v.string(),
        category: v.string(),
        price: v.number(),
        description: v.string(),
        image: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        clinicalGuidance: v.string(),
        usage: v.string(),
        ingredients: v.array(v.string()),
        status: v.union(
            v.literal("active"),
            v.literal("hidden"),
            v.literal("out_of_stock")
        ),
        views: v.number(),
        addToCartCount: v.number(),
        conversionRate: v.number(),
    })
        .index("by_store", ["store"])
        .index("by_category", ["category"])
        .index("by_status", ["status"]),

    // ─── Blog Posts ───────────────────────────────────────────────
    blogPosts: defineTable({
        title: v.string(),
        category: v.string(),
        excerpt: v.string(),
        content: v.string(),
        featuredImage: v.string(),
        tags: v.array(v.string()),
        status: v.union(v.literal("published"), v.literal("draft")),
        publishedDate: v.string(),
        views: v.number(),
        readTimeMin: v.number(),
        engagement: v.number(),
    })
        .index("by_status", ["status"])
        .index("by_category", ["category"]),

    // ─── Consultations ────────────────────────────────────────────
    consultations: defineTable({
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
        notes: v.array(
            v.object({
                id: v.string(),
                text: v.string(),
                timestamp: v.string(),
                author: v.string(),
            })
        ),
    })
        .index("by_status", ["status"])
        .index("by_date", ["date"]),

    // ─── Wellness Programs ────────────────────────────────────────
    programs: defineTable({
        name: v.string(),
        description: v.string(),
        status: v.union(
            v.literal("active"),
            v.literal("draft"),
            v.literal("archived")
        ),
        enrolledCount: v.number(),
        phases: v.array(
            v.object({
                name: v.string(),
                durationWeeks: v.number(),
                description: v.string(),
            })
        ),
        outcomes: v.array(v.string()),
    }).index("by_status", ["status"]),

    // ─── Store Settings (singleton) ───────────────────────────────
    storeSettings: defineTable({
        heroImage: v.string(),
        tagline: v.string(),
        description: v.string(),
        announcementBanner: v.string(),
        partnerBrands: v.array(
            v.object({
                id: v.string(),
                name: v.string(),
                logoUrl: v.string(),
            })
        ),
    }),

    // ─── Orders ───────────────────────────────────────────────────
    orders: defineTable({
        userId: v.optional(v.id("users")),
        items: v.array(
            v.object({
                productId: v.id("products"),
                productName: v.string(),
                price: v.number(),
                quantity: v.number(),
                discount: v.optional(v.number()),
            })
        ),
        shippingDetails: v.object({
            fullName: v.string(),
            email: v.string(),
            address: v.string(),
            city: v.string(),
            province: v.string(),
            zipCode: v.string(),
        }),
        total: v.number(),
        status: v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("shipped"),
            v.literal("delivered"),
            v.literal("cancelled"),
            v.literal("refunded")
        ),
        // Order Intelligence fields (optional for backwards compat)
        paymentMethod: v.optional(v.string()),
        paymentStatus: v.optional(
            v.union(
                v.literal("paid"),
                v.literal("failed"),
                v.literal("refunded"),
                v.literal("partially_refunded")
            )
        ),
        discountCode: v.optional(v.string()),
        discountAmount: v.optional(v.number()),
        shippingCost: v.optional(v.number()),
        tax: v.optional(v.number()),
        currency: v.optional(v.string()),
    }).index("by_status", ["status"])
        .index("by_userId", ["userId"]),

    // ─── Contact Inquiries ────────────────────────────────────────
    contactInquiries: defineTable({
        fullName: v.string(),
        email: v.string(),
        purpose: v.string(),
        message: v.string(),
    }),
});
