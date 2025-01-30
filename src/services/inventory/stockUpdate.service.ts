import { Order, CartItem } from '../../types';
import { db } from '../../lib/firebase/config';
import { runTransaction, doc, getDoc } from 'firebase/firestore';
import { StockUpdateError } from './errors';
import { stockHistoryService } from './stockHistory.service';
import toast from 'react-hot-toast';

class StockUpdateService {
  private getBaseItemId(itemId: string): string {
    const parts = itemId.split('-');
    return parts[0];
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
      await runTransaction(db, async transaction => {
        // Consolidate quantities by base item ID
        const consolidatedItems = this.consolidateOrderItems(order.items);

        // Get all menu items first
        const menuItemDocs = await Promise.all(
          Object.entries(consolidatedItems).map(async ([baseId]) => {
            const docRef = doc(db, 'menu_items', baseId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
              toast.error('Produit de menu introuvable...');

              throw new StockUpdateError(
                `Menu item not found: ${baseId}`,
                'stock/item-not-found'
              );
            }

            return {
              id: docSnap.id,
              ref: docRef,
              data: docSnap.data(),
              exists: true,
            };
          })
        );

        // Track inventory updates
        const inventoryUpdates = new Map<
          string,
          {
            deduction: number;
            currentStock: number;
            ref: any;
            itemName: string;
            cost: number;
          }
        >();

        // Calculate inventory deductions
        for (const menuDoc of menuItemDocs) {
          const orderQuantity = consolidatedItems[menuDoc.id];
          const connections = menuDoc.data.inventoryConnections || [];

          // Update menu item stock
          const currentMenuStock = menuDoc.data.stockQuantity || 0;
          if (currentMenuStock < orderQuantity) {
            toast.error('Quantité insuffisante...');
            throw new StockUpdateError(
              `Insufficient menu item stock for ${menuDoc.data.name}`,
              'stock/insufficient-menu',
              {
                itemId: menuDoc.id,
                required: orderQuantity,
                available: currentMenuStock,
              }
            );
          }

          // Calculate inventory deductions based on connections
          for (const connection of connections) {
            if (!connection.itemId || !connection.ratio) continue;

            const inventoryNeeded = orderQuantity / connection.ratio;
            const currentUpdate = inventoryUpdates.get(connection.itemId);

            if (currentUpdate) {
              currentUpdate.deduction += inventoryNeeded;
            } else {
              const inventoryRef = doc(db, 'inventory', connection.itemId);
              const inventorySnap = await getDoc(inventoryRef);

              if (!inventorySnap.exists()) {
                toast.error("Produit Connexion d'inventaire introuvable...");
                throw new StockUpdateError(
                  `Inventory item not found: ${connection.itemId}`,
                  'stock/inventory-not-found'
                );
              }

              const inventoryData = inventorySnap.data();
              inventoryUpdates.set(connection.itemId, {
                deduction: inventoryNeeded,
                currentStock: inventoryData.quantity || 0,
                ref: inventoryRef,
                itemName: inventoryData.name,
                cost: inventoryData.price * inventoryNeeded,
              });
            }
          }

          // Update menu item stock
          transaction.update(menuDoc.ref, {
            stockQuantity: currentMenuStock - orderQuantity,
            updatedAt: new Date().toISOString(),
          });
        }

        // Validate and update inventory
        for (const [itemId, update] of inventoryUpdates) {
          if (update.currentStock < update.deduction) {
            toast.error('Quantité insuffisante...');
            throw new StockUpdateError(
              'Insufficient inventory',
              'stock/insufficient-inventory',
              {
                itemId,
                required: update.deduction,
                available: update.currentStock,
              }
            );
          }

          // Update inventory
          transaction.update(update.ref, {
            quantity: update.currentStock - update.deduction,
            updatedAt: new Date().toISOString(),
          });

          // Add to stock history
          await stockHistoryService.addUpdate({
            itemId,
            itemName: update.itemName,
            quantity: update.deduction,
            reason: `Commande #${order.id.slice(0, 8)}`,
            cost: update.cost,
            type: 'order',
            orderId: order.id,
            date: new Date().toISOString(),
          });
        }
      });
    } catch (error) {
      console.error('Stock update error:', error);
      if (error instanceof StockUpdateError) {
        throw error;
      }
      toast.error('Une erreur est survenue...');
      throw new StockUpdateError(
        'Failed to update stock levels',
        'stock/update-failed',
        error
      );
    }
  }
}

export const stockUpdateService = new StockUpdateService();
