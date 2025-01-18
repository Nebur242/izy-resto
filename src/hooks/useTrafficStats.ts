import { useMemo } from 'react';
import { Order } from '../types';
import { TrafficStats, TimeRange } from '../types/analytics';

export function useTrafficStats(
  orders: Order[],
  timeRange?: TimeRange
): TrafficStats {
  return useMemo(() => {
    const filteredOrders = timeRange
      ? orders.filter(order => {
          const orderDate = new Date(order.createdAt.seconds * 1000);
          return orderDate >= timeRange.start && orderDate <= timeRange.end;
        })
      : orders;

    // Calculate order statistics
    const dineInOrders = filteredOrders.filter(
      o => o.diningOption === 'dine-in'
    ).length;
    const deliveryOrders = filteredOrders.filter(
      o => o.diningOption === 'delivery'
    ).length;
    const canceledOrders = filteredOrders.filter(
      o => o.status === 'cancelled'
    ).length;
    const fulfilledOrders = filteredOrders.filter(
      o => o.status === 'delivered'
    ).length;
    const pendingOrders = filteredOrders.filter(
      o => o.status === 'pending'
    ).length;

    // Calculate best sellers
    const itemStats = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();

    filteredOrders.forEach(order => {
      if (order.status === 'cancelled') return;

      order.items.forEach(item => {
        const existing = itemStats.get(item.id) || {
          name: item.name,
          quantity: 0,
          revenue: 0,
        };

        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;

        itemStats.set(item.id, existing);
      });
    });

    const bestSellers = Array.from(itemStats.entries())
      .map(([id, stats]) => ({
        id,
        ...stats,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalOrders: filteredOrders.length,
      dineInOrders,
      deliveryOrders,
      canceledOrders,
      fulfilledOrders,
      bestSellers,
      pendingOrders,
    };
  }, [orders, timeRange]);
}
