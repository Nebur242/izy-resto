import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { PaymentMethod } from '../../types/payment';

export async function checkForExistingMethod(name: string): Promise<boolean> {
  const q = query(
    collection(db, 'payment_methods'),
    where('name', '==', name),
    where('active', '==', true)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function checkForExistingDefault(): Promise<boolean> {
  const q = query(
    collection(db, 'payment_methods'),
    where('isDefault', '==', true),
    where('active', '==', true)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export function formatPaymentData(data: Omit<PaymentMethod, 'id'>): Omit<PaymentMethod, 'id'> {
  return {
    ...data,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}