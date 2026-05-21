
'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, collection, DocumentData, query, orderBy } from 'firebase/firestore';
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
      // Mock Listener
      const raw = localStorage.getItem(`mock_db_${path}`) || (path === 'users' ? '{}' : '[]');
      const initial = path === 'users' ? Object.values(JSON.parse(raw)) : JSON.parse(raw);
      setData(initial as T[]);
      setLoading(false);

      const unsubscribe = mockEvents.on(`collection_${path}`, (updatedList: any) => {
        setData(updatedList as T[]);
      });
      return () => unsubscribe();
    } else if (firestore) {
      // Real Listener
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
    }
  }, [path, firestore]);

  return { data, loading, error };
}
