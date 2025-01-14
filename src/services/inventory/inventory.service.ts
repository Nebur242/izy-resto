import { FirestoreService } from '../base/firestore.service';
import { InventoryItem } from '../../types/inventory';
import {
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  doc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { accountingService } from '../accounting/accounting.service';

class InventoryService extends FirestoreService<InventoryItem> {
  constructor() {
    super('inventory');
  }

  async create(item: Omit<InventoryItem, 'id'>): Promise<string> {
    try {
      const id = await runTransaction(db, async transaction => {
        // Create inventory item
        const docRef = doc(collection(db, this.collectionName));
        const newItem = {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        transaction.set(docRef, newItem);

        // Create corresponding transaction
        const totalCost = item.price * item.quantity;
        await accountingService.createTransaction({
          date: new Date().toISOString(),
          source: 'inventory',
          description: `Stock initial: ${item.name} (${item.quantity} ${item.unit})`,
          reference: docRef.id,
          debit: totalCost,
          credit: 0,
          gross: -totalCost,
        });

        return docRef.id;
      });

      return id;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<InventoryItem>): Promise<void> {
    try {
      await runTransaction(db, async transaction => {
        // Get current item state
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists()) throw new Error('Item not found');

        const currentItem = docSnap.data() as InventoryItem;

        // Update inventory item
        transaction.update(docRef, {
          ...data,
          updatedAt: new Date().toISOString(),
        });

        // Create transaction if quantity changed
        if (
          data.quantity !== undefined &&
          data.quantity !== currentItem.quantity
        ) {
          const quantityDiff = data.quantity - currentItem.quantity;
          const price = data.price || currentItem.price;
          const totalCost = Math.abs(quantityDiff * price);

          if (quantityDiff > 0) {
            await accountingService.createTransaction({
              date: new Date().toISOString(),
              source: 'inventory',
              description: `Ajustement stock: ${currentItem.name} (${
                quantityDiff > 0 ? '+' : ''
              }${quantityDiff} ${currentItem.unit})`,
              reference: id,
              debit: quantityDiff > 0 ? totalCost : 0,
              credit: quantityDiff < 0 ? totalCost : 0,
              gross: quantityDiff > 0 ? -totalCost : totalCost,
            });
          }
        }
      });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('quantity', '<=', 'minQuantity')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          } as InventoryItem)
      );
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
  }

  async getExpiringItems(daysThreshold: number = 7): Promise<InventoryItem[]> {
    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

      const q = query(
        collection(db, this.collectionName),
        where('expiryDate', '<=', thresholdDate.toISOString())
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          } as InventoryItem)
      );
    } catch (error) {
      console.error('Error fetching expiring items:', error);
      throw error;
    }
  }
}

export const inventoryService = new InventoryService();
