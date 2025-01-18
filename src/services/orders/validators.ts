import { Order } from '../../types';

export function validateOrder(order: Omit<Order, 'id'>): void {
  // Validate cart items
  if (!Array.isArray(order.items) || order.items.length === 0) {
    throw new Error('Le panier ne peut pas être vide');
  }

  // Validate item quantities and prices
  order.items.forEach(item => {
    const quantity = Number(item.quantity);
    const price = Number(item.price);

    if (isNaN(quantity) || quantity <= 0) {
      throw new Error(`Quantité invalide pour: ${item.name}`);
    }

    if (isNaN(price) || price < 0) {
      throw new Error(`Prix invalide pour: ${item.name}`);
    }

    // Check stock if available
    if (item.stockQuantity !== undefined && quantity > item.stockQuantity) {
      throw new Error(`Stock insuffisant pour: ${item.name}`);
    }
  });

  // Validate total
  const total = Number(order.total);
  if (isNaN(total) || total < 0) {
    throw new Error('Montant total invalide');
  }

  // Validate dates
  if (!order.createdAt || !order.updatedAt) {
    throw new Error('Dates invalides');
  }

  // Validate status
  const validStatuses = ['pending', 'preparing', 'delivered'];
  if (!validStatuses.includes(order.status)) {
    throw new Error('Statut de commande invalide');
  }

  // Sanitize optional fields
  if (order.customerName) {
    order.customerName = order.customerName.trim();
  }
  
  if (order.customerPhone) {
    order.customerPhone = order.customerPhone.trim();
  }
  
  if (order.tableNumber) {
    order.tableNumber = order.tableNumber.trim();
  }
}