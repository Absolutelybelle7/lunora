export interface ProductSpecifications {
  benefits?: string[];
  material?: string;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  images: string[];
  rating: number;
  review_count: number;
  stock_quantity: number;
  category_id: string;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  description: string;
  sku: string;
  specifications?: ProductSpecifications;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  parent_id: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
  user_profiles: { full_name?: string } | null;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: { full_name?: string };
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
    slug: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  total: number;
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  payment_method: string;
  payment_status: string;
  created_at: string;
}
