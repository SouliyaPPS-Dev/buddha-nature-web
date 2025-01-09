// Import the Firebase SDK
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase configuration (get this from Firebase Console -> Project settings -> General -> Firebase SDK snippet)
const firebaseConfig = {
     apiKey: "AIzaSyDFjIl-SEHUsgK0sjMm7x0awpf8tTEPQjs",
     authDomain: "lao-tipitaka.firebaseapp.com",
     databaseURL: "https://lao-tipitaka-default-rtdb.asia-southeast1.firebasedatabase.app",
     projectId: "lao-tipitaka",
     storageBucket: "lao-tipitaka.appspot.com",
     messagingSenderId: "209240803256",
     appId: "1:209240803256:web:cd9feaa1967bc05596f14d",
     measurementId: "G-XNZXZ1FB42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Storage instance
export const storage = getStorage(app);