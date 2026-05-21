
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

    const parts = path.split('/');
    const collectionName = parts[0];
    const docId = parts[1] || '';

    if (isPlaceholder) {
      const getMockDoc = () => {
        const db = JSON.parse(localStorage.getItem(`mock_db_${collectionName}`) || (collectionName === 'users' || collectionName === 'settings' ? '{}' : '[]'));
        return collectionName === 'users' || collectionName === 'settings' ? db[docId] : (Array.isArray(db) ? db.find((d: any) => d.id === docId) : null);
      };

      setData(getMockDoc() || null);
      setLoading(false);

      const unsubscribe = mockEvents.on(`doc_${collectionName}_${docId}`, (updatedData: any) => {
        setData(updatedData);
      });
      return () => unsubscribe();
    } else if (firestore && docId && !isPlaceholder) {
      try {
        const unsubscribe = onSnapshot(
          doc(firestore, collectionName, docId),
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
      } catch (e: any) {
        console.warn("Firestore doc listener failed:", e);
        setLoading(false);
      }
    }
  }, [path, firestore]);

  return { data, loading, error };
}
