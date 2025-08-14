// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg690i_ee428klEah6N1PQriwqiyC-WCI",
  authDomain: "contact-book-dolzen.firebaseapp.com",
  projectId: "contact-book-dolzen",
  storageBucket: "contact-book-dolzen.firebasestorage.app",
  messagingSenderId: "124844958339",
  appId: "1:124844958339:web:fccf6033f182e9dba4b1b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default db;