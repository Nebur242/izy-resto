import { Order } from '../../types';
import { PaymentMethod } from '../../types/payment';
import { Timestamp } from 'firebase/firestore';

export function formatOrderData(
  orderData: Omit<Order, 'id'>, 
  paymentMethod: PaymentMethod | null
): Omit<Order, 'id'> {
  return {
    ...orderData,
    paymentMethod,
    items: orderData.items.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      categoryId: item.categoryId || null
    })),
    status: 'pending',
    total: Number(orderData.total),
    customerName: String(orderData.customerName).trim(),
    customerEmail: orderData.customerEmail ? String(orderData.customerEmail).trim() : null,
    customerPhone: String(orderData.customerPhone).trim(),
    customerAddress: orderData.customerAddress ? String(orderData.customerAddress).trim() : null,
    tableNumber: orderData.tableNumber ? String(orderData.tableNumber).trim() : null,
    diningOption: orderData.diningOption,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
}