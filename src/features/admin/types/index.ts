// ─── Blog Types ──────────────────────────────────────────────
export type BlogStatus = 'published' | 'draft';
export type BlogCategory = 'Menopause' | 'Skin Health' | 'Weight Management' | 'Hormonal Wellness' | 'Skincare Education';

export interface BlogPost {
    id: string;
    title: string;
    category: BlogCategory;
    excerpt: string;
    content: string;
    featuredImage: string;
    tags: string[];
    status: BlogStatus;
    publishedDate: string;
    views: number;
    readTimeMin: number;
    engagement: number; // percentage
}

// ─── Product / Store Types ───────────────────────────────────
export type StoreName = 'House of Langa' | 'Amway' | 'Hemp wellness' | 'Weight Wellness Store' | 'Serum & Sculpt Clinical Skincare';
export type ProductCategory = 'Skincare' | 'Makeup' | 'Wellness' | 'Hemp Range' | 'Tools';
export type ProductStatus = 'active' | 'hidden' | 'out_of_stock';

export interface AdminProduct {
    id: string;
    name: string;
    store: StoreName;
    category: ProductCategory;
    price: number;
    description: string;
    image: string;
    clinicalGuidance: string;
    usage: string;
    ingredients: string[];
    status: ProductStatus;
    views: number;
    addToCartCount: number;
    conversionRate: number; // percentage
}

export interface StoreSettings {
    heroImage: string;
    tagline: string;
    description: string;
    announcementBanner: string;
    partnerBrands: PartnerBrand[];
}

export interface PartnerBrand {
    id: string;
    name: string;
    logoUrl: string;
}

// ─── Consultation Types ──────────────────────────────────────
export type ConsultationStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
export type ConsultationType = 'Initial Consultation' | 'Follow-up' | 'Skin Analysis' | 'Program Review';

export interface ConsultationNote {
    id: string;
    text: string;
    timestamp: string;
    author: string;
}

export interface Consultation {
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    date: string;
    time: string;
    type: ConsultationType;
    status: ConsultationStatus;
    preConsultationNotes: string;
    notes: ConsultationNote[];
}

// ─── Wellness Program Types ──────────────────────────────────
export type ProgramStatus = 'active' | 'draft' | 'archived';

export interface WellnessProgram {
    id: string;
    name: string;
    description: string;
    status: ProgramStatus;
    enrolledCount: number;
    phases: ProgramPhase[];
    outcomes: string[];
}

export interface ProgramPhase {
    name: string;
    durationWeeks: number;
    description: string;
}

// ─── Analytics Types ─────────────────────────────────────────
export interface DashboardStats {
    totalRevenue: number;
    revenueChange: number; // percentage
    activeConsultations: number;
    consultationsChange: number;
    blogViews: number;
    blogViewsChange: number;
    productOrders: number;
    ordersChange: number;
}

export interface RecentActivity {
    id: string;
    type: 'order' | 'blog' | 'booking' | 'program';
    message: string;
    timestamp: string;
}

// ─── Navigation ──────────────────────────────────────────────
export interface AdminNavItem {
    label: string;
    path: string;
    icon: string; // lucide icon name
}
