import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  runTransaction,
  increment,
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

class AnonymousAuthService {
  private auth = getAuth();
  private readonly COLLECTION = 'anonymous_users';

  async signInAnonymously() {
    try {
      const { user } = await signInAnonymously(this.auth);
      await this.initializeUserData(user.uid);
      return user;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      // throw error;
    }
  }

  async initializeUserData(uid: string) {
    const userRef = doc(db, this.COLLECTION, uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        createdAt: Timestamp.now(),
        lastOrderAt: null,
        orderCount: 0,
      });
    }
  }

  async canPlaceOrder(
    uid: string
  ): Promise<{ canOrder: boolean; reason?: string }> {
    try {
      // Get rate limit settings
      const settingsDoc = await getDoc(doc(db, 'settings', 'restaurant'));

      const settings = settingsDoc.data()?.rateLimits || {
        maxOrders: 2,
        timeWindowHours: 1,
      };

      const userRef = doc(db, this.COLLECTION, uid);
      const nowMillis = Timestamp.now().toMillis();
      const timeWindowMillis =
        Number(settings.timeWindowHours) * 60 * 60 * 1000; // Convert hours to milliseconds
      const windowStartMillis = nowMillis - timeWindowMillis;

      const result = await runTransaction(db, async transaction => {
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists()) {
          // If user doesn't exist, create a new document with initial order
          transaction.set(userRef, {
            orderCount: 1,
            lastOrderAt: Timestamp.now(),
          });
          return { canOrder: true };
        }

        const userData = userDoc.data();
        const lastOrderMillis = userData?.lastOrderAt?.toMillis
          ? userData.lastOrderAt.toMillis()
          : 0;

        if (
          userData.orderCount >= settings.maxOrders &&
          lastOrderMillis >= windowStartMillis
        ) {
          // User has reached the limit
          return {
            canOrder: false,
            reason: `Maximum ${settings.maxOrders} commandes autorisées par période de ${settings.timeWindowHours}h`,
          };
        }

        // Check if the last order is outside the current time window
        if (lastOrderMillis < windowStartMillis) {
          // Reset order count and set lastOrderAt to now
          transaction.update(userRef, {
            orderCount: 1, // Reset to 1 for the current order
            lastOrderAt: Timestamp.now(),
          });
        } else {
          // Increment order count and update lastOrderAt
          transaction.update(userRef, {
            orderCount: increment(1),
            lastOrderAt: Timestamp.now(),
          });
        }

        return { canOrder: true };
      });

      return result;
    } catch (error) {
      console.error('Error checking order limit:', error);
      return { canOrder: true }; // Fail open to not block legitimate orders
    }
  }

  onAuthStateChanged(callback: (user: any) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}

export const anonymousAuthService = new AnonymousAuthService();
