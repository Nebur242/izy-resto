import { CartItem } from './cart';
import { VariantOption } from './variant';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  stockQuantity: number;
  variants?: VariantOption[];
}

export interface MenuFilters {
  category?: string;
  search?: string;
}

export interface MenuItemVariantPrice {
  variantCombination: string[];
  price: number;
  image?: string;
  stockQuantity?: number; // Add stock quantity for variants
}

export interface MenuItemWithVariants extends MenuItem {
  variantPrices: MenuItemVariantPrice[];
}