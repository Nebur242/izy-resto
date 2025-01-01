import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { Order, OrderStatus } from '../../types';
import { OrderFilters, OrderServiceError } from './types';

const COLLECTION_NAME = 'orders';

export async function getOrders(filters?: OrderFilters): Promise<Order[]> {
  try {
    let q = collection(db, COLLECTION_NAME);
    const constraints = [];

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters?.dateFrom) {
      constraints.push(where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom)));
    }

    if (filters?.dateTo) {
      constraints.push(where('createdAt', '<=', Timestamp.fromDate(filters.dateTo)));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    q = query(q, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    const serviceError = new Error('Failed to fetch orders') as OrderServiceError;
    serviceError.code = 'orders/fetch-error';
    throw serviceError;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  try {
    const orderRef = doc(db, COLLECTION_NAME, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    const serviceError = new Error('Failed to update order status') as OrderServiceError;
    serviceError.code = 'orders/update-error';
    throw serviceError;
  }
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    const serviceError = new Error('Failed to create order') as OrderServiceError;
    serviceError.code = 'orders/create-error';
    throw serviceError;
  }
}