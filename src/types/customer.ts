export interface CustomerStats {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  orderCount: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
}