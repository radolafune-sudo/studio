
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
  increment as firebaseIncrement,
  setDoc as firebaseSetDoc,
} from 'firebase/firestore';
import { firebaseConfig } from './config';

export const isPlaceholder = !firebaseConfig.apiKey || firebaseConfig.apiKey === "AIzaSy..." || firebaseConfig.apiKey.includes("your-app");

class MockEmitter {
  private listeners: Record<string, ((data: any) => void)[]> = {};
  on(event: string, cb: any) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
    return () => { this.listeners[event] = this.listeners[event].filter(l => l !== cb); };
  }
  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export const mockEvents = new MockEmitter();

// INITIAL MOCK DB STATE WITH REQUESTED ADDRESSES
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('mock_db_settings')) {
    localStorage.setItem('mock_db_settings', JSON.stringify({
      global: {
        wallets: {
          btc: 'bc1qpd4qdygkd59d5ga04rsrp7l5cyt267568km0sy',
          usdt: 'TQVM4CedoPkY552cZMDntRJcGUHMQHkrPn',
          trx: 'TQVM4CedoPkY552cZMDntRJcGUHMQHkrPn',
          eth: '0x0b17448253736dB9F584978c89578E46C1BfbB4A',
          usdc: '0x0b17448253736dB9F584978c89578E46C1BfbB4A'
        }
      }
    }));
  }
}

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
    const numericId = Math.floor(100000000 + Math.random() * 900000000).toString();
    const user = { uid: numericId, email };
    this.currentUser = user;
    localStorage.setItem('mock_user', JSON.stringify(user));
    
    const db = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
    db[user.uid] = { 
      uid: user.uid, 
      email, 
      balance: 0, 
      role: 'user', 
      name: email.split('@')[0], 
      createdAt: new Date().toISOString() 
    };
    localStorage.setItem('mock_db_users', JSON.stringify(db));
    
    mockEvents.emit(`collection_users`, Object.values(db));
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
  async updateDoc(docPath: string, data: any) {
    const parts = docPath.split('/');
    const collectionName = parts[0];
    const docId = parts[1];
    
    const isObjectColl = collectionName === 'users' || collectionName === 'settings';
    const db = JSON.parse(localStorage.getItem(`mock_db_${collectionName}`) || (isObjectColl ? '{}' : '[]'));
    
    if (isObjectColl) {
      const currentDoc = db[docId] || {};
      const updateData = { ...data };
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] && typeof updateData[key] === 'object' && updateData[key]._methodName === 'increment') {
          const currentVal = currentDoc[key] || 0;
          updateData[key] = currentVal + updateData[key]._operand;
        }
      });
      
      db[docId] = { ...currentDoc, ...updateData };
      localStorage.setItem(`mock_db_${collectionName}`, JSON.stringify(db));
      
      setTimeout(() => {
        mockEvents.emit(`doc_${collectionName}_${docId}`, db[docId]);
        mockEvents.emit(`collection_${collectionName}`, Object.values(db));
      }, 0);
    } else {
      const index = db.findIndex((item: any) => item.id === docId || (item.userId === docId && collectionName === 'support_messages'));
      if (index !== -1) {
        db[index] = { ...db[index], ...data };
        localStorage.setItem(`mock_db_${collectionName}`, JSON.stringify(db));
        setTimeout(() => {
          mockEvents.emit(`collection_${collectionName}`, db);
          mockEvents.emit(`doc_${collectionName}_${docId}`, db[index]);
        }, 0);
      }
    }
  }

  async addDoc(collName: string, data: any) {
    const db = JSON.parse(localStorage.getItem(`mock_db_${collName}`) || '[]');
    const newDoc = { ...data, id: Date.now().toString(), timestamp: new Date().toISOString() };
    
    db.push(newDoc);
    localStorage.setItem(`mock_db_${collName}`, JSON.stringify(db));
    
    if (collName === 'deposits' && data.status === 'pending') {
      setTimeout(async () => {
        const latestDb = JSON.parse(localStorage.getItem('mock_db_deposits') || '[]');
        const depIdx = latestDb.findIndex((d: any) => d.id === newDoc.id);
        if (depIdx !== -1 && latestDb[depIdx].status === 'pending') {
          latestDb[depIdx].status = 'approved';
          localStorage.setItem('mock_db_deposits', JSON.stringify(latestDb));
          
          const users = JSON.parse(localStorage.getItem('mock_db_users') || '{}');
          if (users[newDoc.userId]) {
            users[newDoc.userId].balance += newDoc.amount;
            localStorage.setItem('mock_db_users', JSON.stringify(users));
            mockEvents.emit(`doc_users_${newDoc.userId}`, users[newDoc.userId]);
            mockEvents.emit(`collection_users`, Object.values(users));
          }
          mockEvents.emit(`collection_deposits`, latestDb);
        }
      }, 180000); 
    }
    
    setTimeout(() => {
      mockEvents.emit(`collection_${collName}`, db);
    }, 0);
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

export async function updateUserProfile(uid: string, data: any, customColl = 'users') {
  if (isPlaceholder) return mockFirestore.updateDoc(`${customColl}/${uid}`, data);
  const { firestore } = initializeFirebase();
  return firebaseUpdateDoc(doc(firestore, customColl, uid), data);
}

export async function createDeposit(data: any) {
  if (isPlaceholder) return mockFirestore.addDoc("deposits", data);
  const { firestore } = initializeFirebase();
  return firebaseAddDoc(collection(firestore, "deposits"), { ...data, timestamp: serverTimestamp() });
}

export async function sendSupportMessage(userId: string, text: string, isAdmin = false) {
  const data = { userId, text, isAdmin, timestamp: new Date().toISOString() };
  if (isPlaceholder) return mockFirestore.addDoc("support_messages", data);
  const { firestore } = initializeFirebase();
  return firebaseAddDoc(collection(firestore, "support_messages"), { ...data, timestamp: serverTimestamp() });
}

export { serverTimestamp, firebaseIncrement as increment };
export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
