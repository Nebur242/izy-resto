import { CartItem } from './cart';
import { PaymentMethod } from './payment';

export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'cancelled';

export interface OrderRating {
  rating: number;
  feedback?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  customerAddress?: string | null;
  tableNumber?: string | null;
  preference?: string | null;
  diningOption: 'dine-in' | 'delivery';
  paymentMethod: PaymentMethod | null;
  rating?: OrderRating;
  createdAt: any;
  updatedAt: any;
}
