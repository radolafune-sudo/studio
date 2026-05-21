
'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, collection, DocumentData, query } from 'firebase/firestore';
import { useFirestore } from '../provider';
import { isPlaceholder, mockEvents } from '../index';

export function useCollection<T = DocumentData>(path: string | null) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    if (isPlaceholder) {
      const getMockData = () => {
        const raw = localStorage.getItem(`mock_db_${path}`) || (path === 'users' ? '{}' : '[]');
        return path === 'users' ? Object.values(JSON.parse(raw)) : JSON.parse(raw);
      };

      setData(getMockData() as T[]);
      setLoading(false);

      const unsubscribe = mockEvents.on(`collection_${path}`, (updatedList: any) => {
        setData(updatedList as T[]);
      });
      return () => unsubscribe();
    } else if (firestore && !isPlaceholder) {
      try {
        const q = query(collection(firestore, path));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setData(docs as T[]);
            setLoading(false);
          },
          (err) => {
            setError(err);
            setLoading(false);
          }
        );
        return () => unsubscribe();
      } catch (e: any) {
        console.warn("Firestore collection listener failed:", e);
        setLoading(false);
      }
    }
  }, [path, firestore]);

  return { data, loading, error };
}
