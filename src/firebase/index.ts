
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword as firebaseSignIn, 
  createUserWithEmailAndPassword as firebaseCreateUser, 
  signOut as firebaseSignOut, 
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  updateDoc as firebaseUpdateDoc, 
  collection, 
  addDoc as firebaseAddDoc, 
  serverTimestamp, 
  increment as firebaseIncrement 
} from 'firebase/firestore';
import { firebaseConfig } from './config';

export const isPlaceholder = firebaseConfig.apiKey === "AIzaSy..." || !firebaseConfig.apiKey;

// Simple Event Emitter for Mock Reactivity
class MockEmitter {
  private listeners: Record<string, ((data: any) => void)[]> = {};
  on(event: string, cb: any) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
    return () => { this.listeners[event] = this.listeners[event].filter(l => l !== cb); };
  }
  emit(event: string, data: any) {
    if (this.listeners[event]) this.listeners[event].forEach(cb => cb(data));
  }
}

const mockEvents = new MockEmitter();

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
    
    // Initialize user in mock DB
    const db = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
    db[user.uid] = { uid: user.uid, email, balance: 0, role: 'user', name: email.split('@')[0], createdAt: new Date().toISOString() };
    localStorage.setItem('mock_db_users', JSON.stringify(db));
    
    this.notify();
    return { user };
  }

  async signInWithEmailAndPassword(email: string) {
    const users = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
    const user = Object.values(users).find((u: any) => (u as any).email === email);
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
  async setDoc(docId: string, data: any) {
    const db = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
    db[docId] = { ...db[docId], ...data };
    localStorage.setItem('mock_db_users', JSON.stringify(db));
    mockEvents.emit(`doc_users_${docId}`, db[docId]);
    mockEvents.emit(`collection_users`, Object.values(db));
  }
  async updateDoc(docId: string, data: any) { return this.setDoc(docId, data); }
  async getDoc(docId: string) {
    const db = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
    return { exists: () => !!db[docId], data: () => db[docId] };
  }
  async addDoc(collName: string, data: any) {
    const db = JSON.parse(localStorage.getItem(`mock_db_${collName}`) || '[]');
    const newDoc = { ...data, id: Date.now().toString(), timestamp: new Date().toISOString() };
    db.push(newDoc);
    localStorage.setItem(`mock_db_${collName}`, JSON.stringify(db));
    mockEvents.emit(`collection_${collName}`, db);
    return { id: newDoc.id };
  }
}

const mockAuth = new MockAuth();
const mockFirestore = new MockFirestore();

export function initializeFirebase() {
  if (isPlaceholder) {
    return {
      app: {} as FirebaseApp,
      auth: mockAuth as unknown as Auth,
      firestore: mockFirestore as unknown as Firestore
    };
  }

  let app: FirebaseApp;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  return { app, auth: getAuth(app), firestore: getFirestore(app) };
}

// Unified Functional API
export async function loginUser(email: string, pass: string) {
  if (isPlaceholder) return mockAuth.signInWithEmailAndPassword(email);
  const { auth } = initializeFirebase();
  return firebaseSignIn(auth, email, pass);
}

export async function registerUser(email: string, pass: string) {
  if (isPlaceholder) return mockAuth.createUserWithEmailAndPassword(email);
  const { auth } = initializeFirebase();
  return firebaseCreateUser(auth, email, pass);
}

export async function logoutUser() {
  if (isPlaceholder) return mockAuth.signOut();
  const { auth } = initializeFirebase();
  return firebaseSignOut(auth);
}

export async function updateUserProfile(uid: string, data: any) {
  if (isPlaceholder) return mockFirestore.updateDoc(uid, data);
  const { firestore } = initializeFirebase();
  return firebaseUpdateDoc(doc(firestore, "users", uid), data);
}

export async function createDeposit(data: any) {
  if (isPlaceholder) return mockFirestore.addDoc("deposits", data);
  const { firestore } = initializeFirebase();
  return firebaseAddDoc(collection(firestore, "deposits"), { ...data, timestamp: serverTimestamp() });
}

export { mockEvents };
export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
export { serverTimestamp, firebaseIncrement as increment };
