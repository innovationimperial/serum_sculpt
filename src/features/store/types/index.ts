export type StoreName = 'All' | 'House of Langa' | 'Amway' | 'Hemp wellness' | 'Weight Wellness Store' | 'Serum & Sculpt Clinical Skincare';
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
    image: string;
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
