import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  Timestamp,
  orderBy,
  onSnapshot,
  getDoc,
  QuerySnapshot,
  FirestoreError,
  runTransaction,
  limit,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { Order, OrderStatus, TaxRate } from '../../types';
import { accountingService } from '../accounting/accounting.service';
import { stockUpdateService } from '../inventory/stockUpdate.service';
import { validateOrder } from './validators';
import { formatOrderData } from './formatters';
import { OrderServiceError } from './errors';
import type { OrderFilters } from './types';
import { anonymousAuthService } from '../auth/anonymousAuth.service';
import { calculateTaxes, calculateTotal } from '../../utils/tax';

class OrderService {
  private collection = 'orders';

  subscribeToOrders(
    onUpdate: (orders: Order[]) => void,
    onError: (error: Error) => void
  ) {
    try {
      // Optimize query with limit and orderBy
      const q = query(
        collection(db, this.collection),
        orderBy('createdAt', 'desc'),
        limit(1000) // Limit to last 100 orders for better performance
      );

      return onSnapshot(
        q,
        { includeMetadataChanges: true }, // Enable offline support
        (snapshot: QuerySnapshot) => {
          // Only process if snapshot is from server or initial load
          if (!snapshot.metadata.hasPendingWrites) {
            const orders = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })) as Order[];
            onUpdate(orders);
          }
        },
        (error: FirestoreError) => {
          console.error('Firestore subscription error:', error);
          onError(
            new OrderServiceError(
              'Failed to subscribe to orders',
              'orders/subscribe-error',
              error
            )
          );
        }
      );
    } catch (error) {
      console.error('Error setting up orders subscription:', error);
      throw new OrderServiceError(
        'Failed to setup orders subscription',
        'orders/subscribe-setup-error',
        error
      );
    }
  }

  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      let q = collection(db, this.collection);
      const constraints = [];

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters?.dateFrom) {
        constraints.push(
          where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom))
        );
      }

      if (filters?.dateTo) {
        constraints.push(
          where('createdAt', '<=', Timestamp.fromDate(filters.dateTo))
        );
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Order)
      );
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new OrderServiceError(
        'Failed to fetch orders',
        'orders/fetch-error',
        error
      );
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, this.collection, orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Order;
      }

      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new OrderServiceError(
        'Failed to fetch order',
        'orders/fetch-single-error',
        error
      );
    }
  }

  subscribeToOrder(orderId: string, callback: (order: Order) => void) {
    const docRef = doc(db, this.collection, orderId);
    return onSnapshot(docRef, doc => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data(),
        } as Order);
      }
    });
  }

  async createOrder(
    orderData: Omit<Order, 'id'> & {
      taxRates: TaxRate[];
      tip: { amount: number; percentage?: number } | null;
    }
  ): Promise<string> {
    try {
      const user = anonymousAuthService.getCurrentUser();

      if (user?.isAnonymous) {
        // Check rate limit
        const { canOrder, reason } = await anonymousAuthService.canPlaceOrder(
          user.uid
        );
        if (!canOrder) {
          throw new OrderServiceError(
            reason || 'Rate limit exceeded',
            'orders/rate-limit'
          );
        }
      }
      // Validate order data
      validateOrder(orderData);

      // Calculate taxes and total
      const { taxes, total: taxTotal } = calculateTaxes(
        orderData.subtotal,
        orderData.taxRates || [],
        orderData.items.map(item => item.categoryId)
      );

      // Format order data and add user ID
      const order = {
        ...formatOrderData(orderData, orderData.paymentMethod),
        anonymousUid: user?.uid || null,
        subtotal: orderData.subtotal,
        taxes,
        taxTotal,
        tip: orderData.tip || null,
        total: calculateTotal(
          orderData.subtotal,
          taxTotal,
          orderData.tip?.amount || 0
        ),
      };

      // Format order data

      const docRef = await addDoc(collection(db, this.collection), order);
      return docRef.id;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new OrderServiceError(
        error?.message ? error?.message : 'Failed to create order',
        error?.code ? error?.code : 'orders/create-error',
        error
      );
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      await runTransaction(db, async transaction => {
        const docRef = doc(db, this.collection, orderId);
        const docSnap = await transaction.get(docRef);

        if (!docSnap.exists()) {
          throw new OrderServiceError('Order not found', 'orders/not-found');
        }

        const order = { id: docSnap.id, ...docSnap.data() } as Order;
        const previousStatus = order.status;

        // Validate status transition
        if (previousStatus === 'cancelled') {
          throw new OrderServiceError(
            'Cannot update cancelled order',
            'orders/invalid-status-transition'
          );
        }

        if (previousStatus === 'delivered' && status !== 'cancelled') {
          throw new OrderServiceError(
            'Cannot update delivered order',
            'orders/invalid-status-transition'
          );
        }

        // Update order status
        transaction.update(docRef, {
          status,
          updatedAt: Timestamp.now(),
        });

        // If transitioning to delivered, handle related operations
        if (status === 'delivered' && previousStatus !== 'delivered') {
          // Update stock quantities
          await stockUpdateService.updateStockOnDelivery(order);

          // Create accounting transaction
          await accountingService.createOrderTransaction(order);
        }
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error instanceof OrderServiceError) {
        throw error;
      }
      throw new OrderServiceError(
        'Failed to update order status',
        'orders/update-status-error',
        error
      );
    }
  }

  async updateOrderRating(
    orderId: string,
    rating: number,
    feedback?: string
  ): Promise<void> {
    try {
      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new OrderServiceError(
          'Rating must be between 1 and 5',
          'orders/invalid-rating'
        );
      }

      const docRef = doc(db, this.collection, orderId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new OrderServiceError('Order not found', 'orders/not-found');
      }

      const order = docSnap.data() as Order;

      if (order.status !== 'delivered' && order.status !== 'cancelled') {
        throw new OrderServiceError(
          'Cannot rate an order that is not delivered or cancelled',
          'orders/invalid-status'
        );
      }

      if (order.rating) {
        throw new OrderServiceError(
          'Order has already been rated',
          'orders/already-rated'
        );
      }

      await updateDoc(docRef, {
        rating: {
          rating,
          feedback: feedback?.trim() || null,
          createdAt: new Date().toISOString(),
        },
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating order rating:', error);
      if (error instanceof OrderServiceError) {
        throw error;
      }
      throw new OrderServiceError(
        'Failed to update order rating',
        'orders/update-rating-error',
        error
      );
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collection, orderId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new OrderServiceError('Order not found', 'orders/not-found');
      }

      const order = docSnap.data() as Order;

      // Only allow cancellation of pending orders
      if (order.status !== 'pending') {
        throw new OrderServiceError(
          'Only pending orders can be cancelled',
          'orders/invalid-status'
        );
      }

      await updateDoc(docRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      if (error instanceof OrderServiceError) {
        throw error;
      }
      throw new OrderServiceError(
        'Failed to cancel order',
        'orders/cancel-error',
        error
      );
    }
  }
}

export const orderService = new OrderService();
