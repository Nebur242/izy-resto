import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { AccountingServiceError } from './errors';

export async function validateTransactionExists(id: string): Promise<void> {
  const docRef = doc(db, 'transactions', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new AccountingServiceError(
      'Transaction not found',
      'transaction/not-found'
    );
  }
}