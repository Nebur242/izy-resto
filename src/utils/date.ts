import { Timestamp } from 'firebase/firestore';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatFirestoreTimestamp(timestamp: any): string {
  if (!timestamp) return 'Date non disponible';

  try {
    let date: Date;

    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (timestamp.seconds) {
      // Handle raw Firestore timestamp object
      date = new Date(timestamp.seconds * 1000);
    } else {
      throw new Error('Invalid timestamp format');
    }

    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Date non disponible';
  }
}

export function formatDate(date: any, withHours?: boolean = false): string {
  if (!date) return 'Date non disponible';

  try {
    let dateObj: Date;

    if (date instanceof Timestamp) {
      dateObj = date.toDate();
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date.seconds) {
      // Handle raw Firestore timestamp object
      dateObj = new Date(date.seconds * 1000);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      throw new Error('Invalid date format');
    }

    return format(
      dateObj,
      withHours ? "dd MMMM yyyy 'à' HH:mm:ss" : 'dd MMMM yyyy',
      { locale: fr }
    );
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date non disponible';
  }
}
