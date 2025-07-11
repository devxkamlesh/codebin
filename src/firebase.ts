// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzkPrbJdocSuVYLI6Bp_rUgbsUfCH_VWc",
  authDomain: "project-codebin.firebaseapp.com",
  projectId: "project-codebin",
  storageBucket: "project-codebin.firebasestorage.app",
  messagingSenderId: "546433550081",
  appId: "1:546433550081:web:73e55c9370af0939367d00",
  measurementId: "G-NXDXVWVGYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 