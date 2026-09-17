export type CategoryId =
  | 'burgers'
  | 'pizza'
  | 'indian'
  | 'chinese'
  | 'continental'
  | 'salads'
  | 'desserts'
  | 'beverages';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: string;
  deliveryTime: string;
  image: string;
  description: string;
  popular?: boolean;
  isVeg?: boolean;
  isSpicy?: boolean;
  calories?: number;
  serves?: string;
  ingredients?: string[];
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  instructions?: string;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export interface PromoCode {
  code: string;
  discountPercentage?: number;
  discountAmount?: number;
  minOrder: number;
  description: string;
}
