import { FirestoreService } from '../base/firestore.service';
import { Variant } from '../../types/variant';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

class VariantService extends FirestoreService<Variant> {
  constructor() {
    super('variants');
  }

  async getVariantsByCategory(categoryId: string): Promise<Variant[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('categoryIds', 'array-contains', categoryId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Variant));
    } catch (error) {
      console.error('Error fetching variants:', error);
      throw error;
    }
  }

  async create(data: Omit<Variant, 'id'>): Promise<string> {
    return await super.create({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  async update(id: string, data: Partial<Variant>): Promise<void> {
    await super.update(id, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }
}

export const variantService = new VariantService();