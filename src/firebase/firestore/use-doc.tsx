
'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, doc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '../provider';
import { isPlaceholder, mockEvents } from '../index';

export function useDoc<T = DocumentData>(path: string | null) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    if (isPlaceholder) {
      // Mock Listener
      const db = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
      const docId = path.split('/').pop() || '';
      setData(db[docId] || null);
      setLoading(false);

      const unsubscribe = mockEvents.on(`doc_users_${docId}`, (updatedData: any) => {
        setData(updatedData);
      });
      return () => unsubscribe();
    } else if (firestore) {
      // Real Listener
      const unsubscribe = onSnapshot(
        doc(firestore, path),
        (snapshot) => {
          setData(snapshot.data() as T || null);
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
