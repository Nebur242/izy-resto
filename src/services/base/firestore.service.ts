import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  QueryConstraint,
  query,
  getDocs,
  Timestamp,
  where,
  orderBy,
} from 'firebase/firestore';
import { projects } from '../../lib/firebase/projects';
import { FirebaseError } from '../../lib/firebase/utils/errorHandling';
import { db } from '../../lib/firebase/config';
import { InventoryItem } from '../../types';

export class FirestoreService<T extends { id: string }> {
  constructor(
    protected collectionName: string,
    protected projectId: string = 'main'
  ) {}

  protected get db() {
    return projects[this.projectId].firestore;
  }

  async getAll(dateRange?: {
    startDate: Date;
    endDate: Date;
  }): Promise<InventoryItem[]> {
    try {
      let q = collection(db, this.collectionName);
      const constraints = [];

      if (dateRange) {
        constraints.push(
          where('updatedAt', '>=', dateRange.startDate.toISOString()),
          where('updatedAt', '<=', dateRange.endDate.toISOString())
        );
      }

      constraints.push(orderBy('updatedAt', 'desc'));

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryItem[];
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<T> {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        throw new FirebaseError(
          'Document not found',
          'read/not-found',
          this.collectionName
        );
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as T;
    } catch (error) {
      throw new FirebaseError(
        'Failed to fetch document',
        'read/fetch-one',
        this.collectionName
      );
    }
  }

  async create(data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(this.db, this.collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      throw new FirebaseError(
        'Failed to create document',
        'create',
        this.collectionName
      );
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw new FirebaseError(
        'Failed to update document',
        'update',
        this.collectionName
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw new FirebaseError(
        'Failed to delete document',
        'delete',
        this.collectionName
      );
    }
  }
}
