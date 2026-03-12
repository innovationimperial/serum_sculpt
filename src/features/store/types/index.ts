export type StoreName = 'All' | 'House of Langa' | "L'Unako" | 'Weight Wellness Store' | 'Serum and Sculpt Herbal Wellness';
export type Category = 'Skincare' | 'Makeup' | 'Wellness' | 'Hemp Range' | 'Tools';

export interface Product {
    id: string;
    name: string;
    store: StoreName;
    category: Category;
    desc: string;
    price: number;
    bg?: string;
    text?: string;
    images: string[];
    clinicalGuidance?: string;
    ingredients?: string[];
    usage?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface ShippingDetails {
    fullName: string;
    email: string;
    address: string;
    city: string;
    province: string;
    zipCode: string;
}
