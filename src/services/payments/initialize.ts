import {
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  doc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

const DEFAULT_PAYMENT_NAME = 'Paiement à la livraison';
const LOCK_COLLECTION = 'initialization_locks';
const LOCK_DOC_ID = 'default_payment_lock';

export async function initializeDefaultPaymentMethod() {
  try {
    // Use a transaction to ensure atomicity
    await runTransaction(db, async transaction => {
      // Check if initialization lock exists
      // const lockRef = doc(db, LOCK_COLLECTION, LOCK_DOC_ID);
      // const lockSnap = await transaction.get(lockRef);

      // // If lock exists, initialization was already done
      // if (lockSnap.exists()) {
      //   return;
      // }

      // Check for existing default payment method
      const q = query(
        collection(db, 'payment_methods'),
        where('name', '==', DEFAULT_PAYMENT_NAME),
        where('active', '==', true)
      );

      const snapshot = await getDocs(q);

      // If default payment exists, just create lock and return
      if (!snapshot.empty) {
        transaction.set(lockRef, {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        return;
      }

      // Create default payment method
      const paymentRef = doc(collection(db, 'payment_methods'));
      transaction.set(paymentRef, {
        name: DEFAULT_PAYMENT_NAME,
        isDefault: true,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Create initialization lock
      transaction.set(lockRef, {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  } catch (error) {
    console.error('Error initializing default payment method:', error);
  }
}
