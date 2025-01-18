import { useState, useEffect } from 'react';
import { projects } from '../projects';
import type { 
  DocumentData, 
  QueryConstraint, 
  collection, 
  query, 
  getDocs 
} from 'firebase/firestore';

interface UseFirestoreOptions {
  projectId?: string;
  constraints?: QueryConstraint[];
}

export function useFirestore<T = DocumentData>(
  collectionName: string,
  options: UseFirestoreOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { projectId = 'main', constraints = [] } = options;
  const db = projects[projectId].firestore;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const q = constraints.length > 0
          ? query(collection(db, collectionName), ...constraints)
          : collection(db, collectionName);
          
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        
        setData(items);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, db, JSON.stringify(constraints)]);

  return { data, loading, error };
}