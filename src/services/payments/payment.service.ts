import { FirestoreService } from '../base/firestore.service';
import { PaymentMethod } from '../../types/payment';
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { PaymentServiceError } from './errors';
import { validatePaymentMethod } from './validators';
import { initializeDefaultPaymentMethod } from './initialize';
import {
  checkForExistingMethod,
  checkForExistingDefault,
  formatPaymentData,
} from './utils';

const DEFAULT_PAYMENT_NAME = 'Paiement à la livraison';

class PaymentService extends FirestoreService<PaymentMethod> {
  private defaultMethodInitialized = false;

  constructor() {
    super('payment_methods');
  }

  async getActivePaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('active', '==', true)
      );
      const snapshot = await getDocs(q);

      const methods = snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          } as PaymentMethod)
      );

      // Initialize default method only once if no methods exist
      if (methods.length === 0 && !this.defaultMethodInitialized) {
        this.defaultMethodInitialized = true; // Set flag before initialization
        try {
          await initializeDefaultPaymentMethod();
          // Fetch methods again after initialization
          const updatedSnapshot = await getDocs(q);
          const updatedMethods = updatedSnapshot.docs.map(
            doc =>
              ({
                id: doc.id,
                ...doc.data(),
              } as PaymentMethod)
          );
          return this.sortPaymentMethods(updatedMethods);
        } catch (error) {
          console.error('Failed to initialize default payment method:', error);
          return []; // Return empty array if initialization fails
        }
      }

      return this.sortPaymentMethods(methods);
    } catch (error) {
      throw new PaymentServiceError(
        'Failed to fetch payment methods',
        'payment/fetch-error',
        error
      );
    }
  }

  private sortPaymentMethods(methods: PaymentMethod[]): PaymentMethod[] {
    return methods.sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return 0;
    });
  }

  async create(data: Omit<PaymentMethod, 'id'>): Promise<string> {
    try {
      // Validate payment method data
      await validatePaymentMethod(data);

      return await runTransaction(db, async transaction => {
        // Check for existing method with same name
        const exists = await checkForExistingMethod(data.name);
        if (exists) {
          throw new PaymentServiceError(
            'Une méthode de paiement avec ce nom existe déjà',
            'payment/duplicate-name'
          );
        }

        // For default payment method
        if (data.name === DEFAULT_PAYMENT_NAME) {
          const hasDefault = await checkForExistingDefault();
          if (hasDefault) {
            throw new PaymentServiceError(
              'La méthode de paiement par défaut existe déjà',
              'payment/default-exists'
            );
          }
          data.isDefault = true;
        }

        // Create new payment method
        const docRef = doc(collection(db, this.collectionName));
        const newMethod = formatPaymentData(data);

        transaction.set(docRef, newMethod);
        return docRef.id;
      });
    } catch (error) {
      if (error instanceof PaymentServiceError) {
        throw error;
      }
      throw new PaymentServiceError(
        'Failed to create payment method',
        'payment/create-error',
        error
      );
    }
  }

  async update(id: string, data: Partial<PaymentMethod>): Promise<void> {
    try {
      await runTransaction(db, async transaction => {
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await transaction.get(docRef);

        if (!docSnap.exists()) {
          throw new PaymentServiceError(
            'Payment method not found',
            'payment/not-found'
          );
        }

        const currentMethod = docSnap.data() as PaymentMethod;

        // Check for name uniqueness if name is being updated
        if (data.name && data.name !== currentMethod.name) {
          const exists = await checkForExistingMethod(data.name);
          if (exists) {
            throw new PaymentServiceError(
              'Une méthode de paiement avec ce nom existe déjà',
              'payment/duplicate-name'
            );
          }
        }

        const updateData = {
          ...data,
          updatedAt: new Date().toISOString(),
        };

        transaction.update(docRef, updateData);
      });
    } catch (error) {
      if (error instanceof PaymentServiceError) {
        throw error;
      }
      throw new PaymentServiceError(
        'Failed to update payment method',
        'payment/update-error',
        error
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await runTransaction(db, async transaction => {
        const docRef = doc(db, this.collectionName, id);
        const docSnap = await transaction.get(docRef);

        if (!docSnap.exists()) {
          throw new PaymentServiceError(
            'Payment method not found',
            'payment/not-found'
          );
        }

        // Prevent deleting default payment method
        const method = docSnap.data() as PaymentMethod;
        if (method.name === DEFAULT_PAYMENT_NAME) {
          throw new PaymentServiceError(
            'La méthode de paiement par défaut ne peut pas être supprimée',
            'payment/delete-default'
          );
        }

        // Soft delete by setting active to false
        transaction.update(docRef, {
          active: false,
          updatedAt: new Date().toISOString(),
        });
      });
    } catch (error) {
      if (error instanceof PaymentServiceError) {
        throw error;
      }
      throw new PaymentServiceError(
        'Failed to delete payment method',
        'payment/delete-error',
        error
      );
    }
  }
}

export const paymentService = new PaymentService();
