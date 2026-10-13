import type { Product } from '../types';

export interface ComboOffer {
  id: string;
  name: string;
  tagline: string;
  description: string;
  items: string[];
  regularPrice: number;
  comboPrice: number;
  savings: number;
  image: string;
  serves: string;
  badge?: string;
  rating: number;
  reviews: string;
  deliveryTime: string;
}

export const COMBO_OFFERS: ComboOffer[] = [
  {
    id: 'classic-burger-combo',
    name: 'Classic Burger & Fries Combo',
    tagline: 'The Ultimate Gourmet Burger Duo',
    description: 'Juicy handcrafted Classic Burger paired with golden salted Crispy French Fries and an artisanal iced beverage.',
    items: ['1x Classic Gourmet Burger', '1x Crispy Golden French Fries', '1x Iced Lemon Mint Cooler'],
    regularPrice: 308,
    comboPrice: 249,
    savings: 59,
    image: '/Images/File27/Classic Burger & Fries Combo.png',
    serves: '1-2 People',
    badge: 'Popular Choice',
    rating: 4.9,
    reviews: '2.4k',
    deliveryTime: '20 mins',
  },
  {
    id: 'mexican-taco-combo',
    name: 'Mexican Taco Fiesta Combo',
    tagline: 'Zesty Mexican Crunch & Seasoned Sides',
    description: 'Signature Taco Chicken Mexican stuffed with chipotle crema, complemented by peri peri fries and Mexican salsa dip.',
    items: ['2x Taco Chicken Mexican', '1x Peri Peri Seasoned Fries', '1x Zesty Citrus Mojito'],
    regularPrice: 427,
    comboPrice: 349,
    savings: 78,
    image: '/Images/Taco Chicken Mexican.png',
    serves: '1-2 People',
    badge: 'Chef Special',
    rating: 4.8,
    reviews: '1.6k',
    deliveryTime: '20 mins',
  },
  {
    id: 'pizza-party-combo',
    name: 'Italian Pizza & Pasta Party Combo',
    tagline: 'Authentic Mediterranean Indulgence',
    description: 'Freshly baked Margherita Pizza with creamy Pasta Alfredo and oven-baked garlic herb sourdough bread.',
    items: ['1x Hand-stretched Margherita Pizza (10")', '1x Pasta Alfredo Bowl', '1x Cheesy Garlic Herb Bread'],
    regularPrice: 637,
    comboPrice: 499,
    savings: 138,
    image: '/Images/File27/Italian Pizza & Pasta Party Combo.png',
    serves: '2-3 People',
    badge: 'Best Value',
    rating: 4.9,
    reviews: '3.1k',
    deliveryTime: '25 mins',
  },
  {
    id: 'chinese-feast-combo',
    name: 'Wok & Wings Chinese Feast Combo',
    tagline: 'Spicy Sizzling Street Flavours',
    description: 'Wok tossed Schezwan Fried Rice alongside fiery Kung Pao Chicken and crispy vegetable spring rolls.',
    items: ['1x Kung Pao Chicken Stir-Fry', '1x Wok Schezwan Fried Rice', '1x Crispy Spring Rolls (4 pcs)'],
    regularPrice: 597,
    comboPrice: 479,
    savings: 118,
    image: '/Images/File27/Wok & Wings Chinese Feast.png',
    serves: '2-3 People',
    badge: 'Spicy Deal',
    rating: 4.7,
    reviews: '1.8k',
    deliveryTime: '25 mins',
  },
  {
    id: 'royal-indian-combo',
    name: 'Royal Indian Feast Combo',
    tagline: 'Authentic Heritage Mughlai Delicacies',
    description: 'Slow Simmered Dal Makhani infused with white butter, served with Tandoori Soya Chaap Tikka and two warm butter naans.',
    items: ['1x Slow Simmered Dal Makhani', '1x Tandoori Soya Chaap Tikka', '2x Charred Butter Naan'],
    regularPrice: 508,
    comboPrice: 399,
    savings: 109,
    image: '/Images/1/Slow Simmered Dal Makhani.png',
    serves: '2 People',
    badge: 'Customer Favorite',
    rating: 4.9,
    reviews: '2.9k',
    deliveryTime: '25 mins',
  },
  {
    id: 'shake-snack-combo',
    name: 'Shake & Snack Indulgence Combo',
    tagline: 'Sweet, Savoury & Pure Bliss',
    description: 'Decadent Belgian Chocolate Shake blended with rich dark ganache, alongside the Truffle Mushroom Swiss Burger.',
    items: ['1x Truffle Mushroom Swiss Burger', '1x Belgian Chocolate Thick Shake', '1x Salted Crinkle Cut Fries'],
    regularPrice: 467,
    comboPrice: 379,
    savings: 88,
    image: '/Images/1/Truffle Mushroom Swiss Burger.png',
    serves: '1-2 People',
    badge: 'Sweet & Savoury',
    rating: 4.8,
    reviews: '1.3k',
    deliveryTime: '20 mins',
  },
];

/**
 * Converts a combo offer into a valid purchasable product line item
 * for immediate compatibility with existing cart, checkout, and order tracking.
 */
export function comboToProduct(combo: ComboOffer): Product {
  return {
    id: `combo-${combo.id}`,
    name: combo.name,
    category: 'continental',
    price: combo.comboPrice,
    originalPrice: combo.regularPrice,
    rating: combo.rating,
    reviews: combo.reviews,
    deliveryTime: combo.deliveryTime,
    image: combo.image,
    description: `${combo.description} (Includes: ${combo.items.join(', ')})`,
    popular: true,
    isVeg: false,
    calories: 780,
    serves: combo.serves,
    ingredients: combo.items,
    badge: combo.badge || 'Combo Deal',
  };
}
