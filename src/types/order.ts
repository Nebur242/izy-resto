import { CartItem } from './cart';
import { PaymentMethod } from './payment';
import { TaxRate } from './settings';

export interface OrderTax {
  id: string;
  name: string;
  rate: number;
  amount: number;
}

export interface OrderTip {
  amount: number;
  percentage?: number;
}

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
  subtotal: number; // Price before tax and tip
  taxes: OrderTax[]; // Array of applied taxes
  taxTotal: number; // Total tax amount
  tip: OrderTip | null;
  amountPaid?: number;
  change?: number;
  servedBy?: string;
}
