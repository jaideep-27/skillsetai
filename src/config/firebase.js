import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuUsF_957PSzJp7S2fPhlyVo_Pe9zZ0Qg",
  authDomain: "skillsetai.firebaseapp.com",
  projectId: "skillsetai",
  storageBucket: "skillsetai.firebasestorage.app",
  messagingSenderId: "243822852731",
  appId: "1:243822852731:web:f11df35b589316738d80de",
  measurementId: "G-TL315TL0T2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth();
auth.useDeviceLanguage(); // Set language to device language

// Initialize Firestore
const db = getFirestore();

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Initialize Analytics
let analytics = null;
isSupported().then(yes => yes ? analytics = getAnalytics(app) : null);

export { auth, db, analytics, googleProvider };
