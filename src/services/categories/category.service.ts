import { FirestoreService } from '../base/firestore.service';
import { Category } from '../../types';
import { FirebaseError } from '../../lib/firebase/utils/errorHandling';
import { orderBy, query, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

class CategoryService extends FirestoreService<Category> {
  constructor() {
    super('categories');
  }

  async getCategories(): Promise<Category[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new FirebaseError(
        'Failed to fetch categories',
        'read/fetch-all',
        'categories'
      );
    }
  }

  async create(category: Omit<Category, 'id'>): Promise<string> {
    try {
      // Generate slug from name
      const slug = category.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      return await super.create({
        ...category,
        slug,
        order: category.order || 0
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw new FirebaseError(
        'Failed to create category',
        'create',
        'categories'
      );
    }
  }
}

export const categoryService = new CategoryService();