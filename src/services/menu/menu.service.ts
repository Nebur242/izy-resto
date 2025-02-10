import { FirestoreService } from '../base/firestore.service';
import { MenuItem, MenuItemWithVariants } from '../../types';
import type { MenuFilters } from './types';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { MenuServiceError } from './errors';

class MenuService extends FirestoreService<MenuItem> {
  constructor() {
    super('menu_items');
  }

  async getMenuItems(filters?: MenuFilters): Promise<MenuItemWithVariants[]> {
    try {
      let q = collection(db, this.collectionName);
      const constraints = [];

      if (filters?.category && filters?.category !== 'all') {
        constraints.push(where('categoryId', '==', filters.category));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints) as any;
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<MenuItemWithVariants, 'id'>),
        }))
        .map(item => {
          return {
            ...item,
            variantPrices:
              item?.variantPrices?.filter(
                vp => vp?.variantCombination?.length > 0
              ) || [],
          };
        });
      return data;
    } catch (error) {
      console.log(error);
      throw new MenuServiceError(
        'Failed to fetch menu items',
        'menu/fetch-error',
        error
      );
    }
  }

  async update(id: string, data: Partial<MenuItemWithVariants>): Promise<void> {
    try {
      await runTransaction(db, async transaction => {
        // Get current item state
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await transaction.get(docRef);

        if (!docSnap.exists()) {
          throw new MenuServiceError('Menu item not found', 'menu/not-found');
        }

        const currentItem = docSnap.data() as MenuItemWithVariants;

        // Validate variant combinations if updating them
        if (data.variantPrices) {
          // Check for duplicate combinations
          const combinations = data.variantPrices.map(vp =>
            [...vp.variantCombination].sort().join('|')
          );
          const uniqueCombinations = new Set(combinations);

          if (combinations.length !== uniqueCombinations.size) {
            throw new MenuServiceError(
              'Duplicate variant combinations found',
              'menu/duplicate-variants'
            );
          }

          // Format variant prices
          data.variantPrices = data?.variantPrices.map(vp => ({
            variantCombination: [...vp.variantCombination]
              .filter(item => {
                return !!item && !item.includes('null');
              })
              .sort(),
            price: Number(vp.price),
            image: vp?.image,
          }));
        }

        // Update the document
        const updateData = {
          ...data,
          updatedAt: new Date().toISOString(),
        };

        transaction.update(docRef, updateData);
      });
    } catch (error) {
      if (error instanceof MenuServiceError) {
        throw error;
      }

      throw new MenuServiceError(
        'Failed to update menu item',
        'menu/update-error',
        error
      );
    }
  }

  async create(data: Omit<MenuItemWithVariants, 'id'>): Promise<string> {
    try {
      // Validate variant combinations if present
      if (data.variantPrices) {
        const combinations = data.variantPrices.map(vp =>
          [...vp.variantCombination].sort().join('|')
        );
        const uniqueCombinations = new Set(combinations);

        if (combinations.length !== uniqueCombinations.size) {
          throw new MenuServiceError(
            'Duplicate variant combinations found',
            'menu/duplicate-variants'
          );
        }

        // Format variant prices
        data.variantPrices = data.variantPrices.map(vp => ({
          variantCombination: [...vp.variantCombination].sort().filter(item => {
            return !!item && !item.includes('null');
          }),
          price: Number(vp.price),
          image: vp?.image,
        }));
      }

      const createData = {
        ...data,
        price: Number(data.price),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await super.create(createData);
      return docRef;
    } catch (error) {
      if (error instanceof MenuServiceError) {
        throw error;
      }
      throw new MenuServiceError(
        'Failed to create menu item',
        'menu/create-error',
        error
      );
    }
  }
}

export const menuService = new MenuService();
