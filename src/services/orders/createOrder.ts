import { Order, CartItem } from '../../types';
import { orderService } from './order.service';

interface CreateOrderInput {
  items: CartItem[];
  total: number;
  tableNumber?: string;
  customerInfo: {
    name?: string;
    phone?: string;
  };
}

export async function createPosOrder({
  items,
  total,
  tableNumber,
  customerInfo,
}: CreateOrderInput): Promise<string> {
  // Only validate cart items
  if (!items?.length) {
    throw new Error('Le panier ne peut pas être vide');
  }

  // Format order data
  const orderData: Omit<Order, 'id'> = {
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image,
      categoryId: item.categoryId,
      stockQuantity: item.stockQuantity,
      selectedVariants: item.selectedVariants
    })),
    status: 'pending',
    total: Number(total),
    customerName: customerInfo.name?.trim() || 'Client',
    customerEmail: null, // Email removed
    customerPhone: customerInfo.phone?.trim() || '',
    diningOption: 'dine-in',
    tableNumber: tableNumber?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Create order
  return await orderService.createOrder(orderData);
}