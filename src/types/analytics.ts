export interface TrafficStats {
  totalOrders: number;
  dineInOrders: number;
  deliveryOrders: number;
  canceledOrders: number;
  fulfilledOrders: number;
  pendingOrders: number;
  bestSellers: BestSeller[];
}

export interface BestSeller {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}
