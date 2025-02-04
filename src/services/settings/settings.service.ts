import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { FirebaseError } from '../../lib/firebase/utils/errorHandling';
import { DEFAULT_SETTINGS } from '../../constants/defaultSettings';
import { RestaurantSettings } from '../../types/settings';

class SettingsService {
  private collection = 'settings';
  private document = 'restaurant';

  async getSettings(): Promise<RestaurantSettings> {
    try {
      const docRef = doc(db, this.collection, this.document);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...DEFAULT_SETTINGS,
          ...docSnap.data(),
        } as RestaurantSettings;
      }

      return DEFAULT_SETTINGS;
    } catch (error) {
      console.log('Error fetching settings:', error);
      console.error('Error fetching settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  async updateSettings(settings: Partial<RestaurantSettings>): Promise<void> {
    try {
      const docRef = doc(db, this.collection, this.document);
      await setDoc(docRef, settings, { merge: true });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new FirebaseError(
        'Failed to update settings',
        'write/update',
        'settings'
      );
    }
  }

  async initializeDefaultSettings(): Promise<void> {
    try {
      const docRef = doc(db, this.collection, this.document);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error initializing default settings:', error);
    }
  }
}

export const settingsService = new SettingsService();
