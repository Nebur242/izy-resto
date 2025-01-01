```typescript
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
  createdAt: string;
}
```