// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyADaeQhe_LF6C3EuHet8OQPxvqNRSKYRao",
  authDomain: "vizassistant-d0932.firebaseapp.com",
  projectId: "vizassistant-d0932",
  storageBucket: "vizassistant-d0932.firebasestorage.app",
  messagingSenderId: "237590221411",
  appId: "1:237590221411:web:c31f58af6454b22930de56"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Add additional scopes if needed
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;