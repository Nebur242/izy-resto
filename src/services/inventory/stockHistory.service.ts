
import { collection, query, orderBy, getDocs, addDoc, where, limit, startAfter } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { StockUpdateError } from './errors';

interface StockUpdate {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  reason: string;
  cost: number;
  date: string;
}

interface GetHistoryOptions {
  startDate?: Date;
  endDate?: Date;
  itemId?: string;
  page?: number;
  pageSize?: number;
  lastDoc?: any;
}

interface HistoryResponse {
  updates: StockUpdate[];
  totalCount: number;
  lastDoc?: any;
}

class StockHistoryService {
  private readonly collection = 'stock_history';

  async getHistory(options: GetHistoryOptions = {}): Promise<HistoryResponse> {
    try {
      const {
        startDate,
        endDate,
        itemId,
        page = 1,
        pageSize = 10,
        lastDoc
      } = options;

      // Build query constraints
      const constraints: any[] = [orderBy('date', 'desc')];

      if (startDate) {
        constraints.push(where('date', '>=', startDate.toISOString()));
      }

      if (endDate) {
        constraints.push(where('date', '<=', endDate.toISOString()));
      }

      if (itemId) {
        constraints.push(where('itemId', '==', itemId));
      }

      // Get total count first
      const countQuery = query(collection(db, this.collection), ...constraints);
      const countSnapshot = await getDocs(countQuery);
      const totalCount = countSnapshot.size;

      // Add pagination constraints
      constraints.push(limit(pageSize));
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      // Get paginated data
      const q = query(collection(db, this.collection), ...constraints);
      const snapshot = await getDocs(q);

      const updates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StockUpdate[];

      return {
        updates,
        totalCount,
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error('Error fetching stock history:', error);
      throw new StockUpdateError(
        'Failed to fetch stock history',
        'history/fetch-error',
        error
      );
    }
  }

  async addUpdate(update: Omit<StockUpdate, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...update,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding stock update:', error);
      throw new StockUpdateError(
        'Failed to add stock update',
        'history/add-error',
        error
      );
    }
  }
}

export const stockHistoryService = new StockHistoryService();
