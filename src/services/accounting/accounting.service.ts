import { FirestoreService } from '../base/firestore.service';
import { Transaction, AccountingStats } from '../../types/accounting';
import { Order } from '../../types';
import { collection, query, where, getDocs, runTransaction, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

class AccountingService extends FirestoreService<Transaction> {
  constructor() {
    super('transactions');
  }

  async getTransactions(period: { startDate: Date; endDate: Date }): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('date', '>=', period.startDate.toISOString()),
        where('date', '<=', period.endDate.toISOString())
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        debit: Number(doc.data().debit || 0),
        credit: Number(doc.data().credit || 0),
        gross: Number(doc.data().gross || 0)
      })) as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async createOrderTransaction(order: Order): Promise<string> {
    try {
      return await runTransaction(db, async (transaction) => {
        // Create transaction for the order
        const docRef = doc(collection(db, this.collectionName));
        
        const newTransaction = {
          date: new Date().toISOString(),
          source: 'orders',
          description: `Commande #${order.id.slice(0, 8)} - ${order.customerName}`,
          reference: order.id,
          debit: 0,
          credit: order.total,
          gross: order.total,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        transaction.set(docRef, newTransaction);
        return docRef.id;
      });
    } catch (error) {
      console.error('Error creating order transaction:', error);
      throw error;
    }
  }

  async createTransaction(data: Omit<Transaction, 'id'>): Promise<string> {
    try {
      return await runTransaction(db, async (transaction) => {
        const docRef = doc(collection(db, this.collectionName));
        const newTransaction = {
          ...data,
          debit: Number(data.debit || 0),
          credit: Number(data.credit || 0),
          gross: Number(data.credit || 0) - Number(data.debit || 0),
          date: data.date || new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        transaction.set(docRef, newTransaction);
        return docRef.id;
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await transaction.get(docRef);
        
        if (!docSnap.exists()) {
          throw new Error('Transaction not found');
        }

        const currentTransaction = docSnap.data() as Transaction;
        
        const debit = data.debit !== undefined ? Number(data.debit) : Number(currentTransaction.debit || 0);
        const credit = data.credit !== undefined ? Number(data.credit) : Number(currentTransaction.credit || 0);
        const gross = credit - debit;

        const updatedTransaction = {
          ...currentTransaction,
          ...data,
          debit,
          credit,
          gross,
          updatedAt: new Date().toISOString()
        };

        transaction.update(docRef, updatedTransaction);
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists()) {
          throw new Error('Transaction not found');
        }
        transaction.delete(docRef);
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
}

export const accountingService = new AccountingService();