export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  category: string;
  price: number;
  supplier?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockUpdate {
  itemId: string;
  quantity: number;
  reason: string;
}

export interface StockHistory {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  reason: string;
  cost: number;
  date: string;
  createdAt?: string;
}
