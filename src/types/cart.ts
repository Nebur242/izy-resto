import { MenuItem } from './menu';

export interface CartItem extends MenuItem {
  selectedVariants: any;
  quantity: number;
}
