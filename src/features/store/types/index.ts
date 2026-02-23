export type Category = 'Skincare' | 'Makeup' | 'Wellness' | 'Hemp' | 'Tools' | 'All';

export interface Product {
    id: string;
    name: string;
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
