import { MenuItem, Category, Order } from '../../types';
import { StaffMember } from '../../types/staff';
import { MediaFile } from '../../types/media';
import { Transaction } from '../../types/accounting';
import { InventoryItem } from '../../types/inventory';
import { PaymentMethod } from '../../types/payment';

export type ApiAction = 
  | { type: 'SET_MENU'; payload: MenuItem[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_STAFF'; payload: StaffMember[] }
  | { type: 'SET_MEDIA'; payload: MediaFile[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_INVENTORY'; payload: InventoryItem[] }
  | { type: 'SET_PAYMENTS'; payload: PaymentMethod[] };

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface ApiState {
  menu: {
    items: MenuItem[];
    lastFetched: number | null;
    pagination: PaginationState;
  };
  categories: {
    items: Category[];
    lastFetched: number | null;
    pagination: PaginationState;
  };
  orders: {
    items: Order[];
    lastFetched: number | null;
    pagination: PaginationState;
  };
  staff: {
    items: StaffMember[];
    lastFetched: number | null;
    pagination: PaginationState;
  };
}

export interface ApiContextType extends ApiState {
  refreshMenu: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshStaff: () => Promise<void>;
  setPagination: (section: keyof ApiState, pagination: Partial<PaginationState>) => void;
}