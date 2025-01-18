import { Order, CartItem } from '../../types';
import { db } from '../../lib/firebase/config';
import { runTransaction, doc } from 'firebase/firestore';
import { StockUpdateError } from './errors';

class StockUpdateService {
  private getBaseItemId(itemId: string): string {
    // Handle multiple variant types by taking everything before the first variant
    const parts = itemId.split('-');
    return parts[0]; // Return the base ID before any variant info
  }

  private consolidateOrderItems(items: CartItem[]): { [key: string]: number } {
    return items.reduce((acc, item) => {
      const baseId = this.getBaseItemId(item.id);
      if (!baseId) {
        throw new StockUpdateError(
          'Invalid item ID format',
          'stock/invalid-id',
          { itemId: item.id }
        );
      }
      acc[baseId] = (acc[baseId] || 0) + item.quantity;
      return acc;
    }, {} as { [key: string]: number });
  }

  async updateStockOnDelivery(order: Order): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        // Consolidate quantities by base item ID
        const consolidatedItems = this.consolidateOrderItems(order.items);

        // Create refs for base items
        const itemRefs = Object.entries(consolidatedItems).map(([baseId, quantity]) => ({
          ref: doc(db, 'menu_items', baseId),
          quantity,
          baseId
        }));

        // First read all items to validate stock
        const stockLevels = await Promise.all(
          itemRefs.map(async ({ ref, baseId }) => {
            const doc = await transaction.get(ref);
            if (!doc.exists()) {
              throw new StockUpdateError(
                'Menu item not found',
                'stock/item-not-found',
                { itemId: baseId }
              );
            }
            return {
              ref,
              currentStock: doc.data().stockQuantity || 0,
              item: doc.data()
            };
          })
        );

        // Validate all stock levels before making any updates
        const insufficientStock = stockLevels.map((stock, index) => {
          const orderQuantity = itemRefs[index].quantity;
          if (stock.currentStock < orderQuantity) {
            return {
              itemName: stock.item.name,
              required: orderQuantity,
              available: stock.currentStock
            };
          }
          return null;
        }).filter(Boolean);

        if (insufficientStock.length > 0) {
          throw new StockUpdateError(
            'Insufficient stock for some items',
            'stock/insufficient',
            insufficientStock
          );
        }

        // All validations passed, perform updates
        stockLevels.forEach((stock, index) => {
          const orderQuantity = itemRefs[index].quantity;
          transaction.update(stock.ref, {
            stockQuantity: stock.currentStock - orderQuantity,
            updatedAt: new Date().toISOString()
          });
        });
      });
    } catch (error) {
      console.error('Stock update error:', error);
      if (error instanceof StockUpdateError) {
        throw error;
      }
      throw new StockUpdateError(
        'Failed to update stock levels',
        'stock/update-failed',
        error
      );
    }
  }
}

export const stockUpdateService = new StockUpdateService();