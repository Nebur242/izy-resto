export interface Variant {
  id: string;
  name: string;
  type: string;
  values: string[];
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VariantOption {
  variantId: string;
  value: string;
}

export interface MenuItemVariant {
  menuItemId: string;
  variants: VariantOption[];
}

export interface VariantCombination {
  id: string;
  values: string[];
  price: number;
  image?: string;
}