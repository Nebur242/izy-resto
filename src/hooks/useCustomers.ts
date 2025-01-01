import { useMemo } from 'react';
import { Order } from '../types';
import { CustomerStats } from '../types/customer';

export function useCustomers(orders: Order[]) {
  return useMemo(() => {
    const customerMap = new Map<string, CustomerStats>();
    
    orders.forEach(order => {
      const customerId = order.customerEmail || order.customerPhone;
      const customer = customerMap.get(customerId);
      
      if (customer) {
        customer.orderCount++;
        customer.totalSpent += order.total;
        customer.lastOrderDate = new Date(order.createdAt).getTime() > new Date(customer.lastOrderDate).getTime() 
          ? order.createdAt 
          : customer.lastOrderDate;
      } else {
        customerMap.set(customerId, {
          id: customerId,
          name: order.customerName,
          email: order.customerEmail || null,
          phone: order.customerPhone,
          orderCount: 1,
          totalSpent: order.total,
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt
        });
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);
}