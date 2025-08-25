// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvOEkZ1jA3IxQfEJ2Ub8-DjHSTd0yLDy4",
  authDomain: "mood--bundle.firebaseapp.com",
  projectId: "mood--bundle",
  storageBucket: "mood--bundle.firebasestorage.app",
  messagingSenderId: "245467368956",
  appId: "1:245467368956:web:05fc85184d2dea2cf27679",
  measurementId: "G-CC0TJ1C8G8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);