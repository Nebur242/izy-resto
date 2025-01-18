import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { MenuServiceError } from './errors';

export async function validateMenuItemExists(id: string): Promise<void> {
  const docRef = doc(db, 'menu_items', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new MenuServiceError(
      'Menu item not found',
      'menu/item-not-found'
    );
  }
}