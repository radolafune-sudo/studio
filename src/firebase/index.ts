
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Simulated Security Layer (Local Persistence)
class MockAuth {
  private listeners: ((user: any) => void)[] = [];
  currentUser: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock_user');
      if (stored) this.currentUser = JSON.parse(stored);
    }
  }

  onAuthStateChanged(cb: any) {
    this.listeners.push(cb);
    cb(this.currentUser);
    return () => { this.listeners = this.listeners.filter(l => l !== cb); };
  }

  async createUserWithEmailAndPassword(email: string) {
    const user = { uid: `mock_${Date.now()}`, email };
    this.currentUser = user;
    localStorage.setItem('mock_user', JSON.stringify(user));
    this.notify();
    return { user };
  }

  async signInWithEmailAndPassword(email: string) {
    const users = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
    const user = Object.values(users).find((u: any) => u.email === email);
    if (!user) throw new Error("User not found");
    this.currentUser = { uid: (user as any).uid, email: (user as any).email };
    localStorage.setItem('mock_user', JSON.stringify(this.currentUser));
    this.notify();
    return { user: this.currentUser };
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('mock_user');
    this.notify();
  }

  private notify() { this.listeners.forEach(l => l(this.currentUser)); }
}

class MockFirestore {
  async setDoc(docRef: any, data: any) {
    const db = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
    db[docRef.id] = { ...db[docRef.id], ...data };
    localStorage.setItem('mock_db_users', JSON.stringify(db));
  }
  async updateDoc(docRef: any, data: any) { return this.setDoc(docRef, data); }
  async getDoc(docRef: any) {
    const db = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
    return { exists: () => !!db[docRef.id], data: () => db[docRef.id] };
  }
  doc(_: any, coll: string, id: string) { return { id, coll }; }
  collection(_: any, name: string) { return { name }; }
  async addDoc(collRef: any, data: any) {
    const db = JSON.parse(localStorage.getItem(`mock_db_${collRef.name}`) || '[]');
    db.push({ ...data, id: Date.now() });
    localStorage.setItem(`mock_db_${collRef.name}`, JSON.stringify(db));
  }
  onSnapshot(ref: any, cb: any) {
    const update = () => {
      const db = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
      cb({ data: () => db[ref.id], exists: () => !!db[ref.id] });
    };
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }
}

export function initializeFirebase() {
  const isPlaceholder = firebaseConfig.apiKey === "AIzaSy..." || !firebaseConfig.apiKey;
  
  if (isPlaceholder) {
    console.warn("Using Simulated Security Layer (Local Simulation)");
    return {
      app: {} as FirebaseApp,
      auth: new MockAuth() as unknown as Auth,
      firestore: new MockFirestore() as unknown as Firestore
    };
  }

  let app: FirebaseApp;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
