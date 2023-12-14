// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAWdiX6Dozo5CCPD8H7z-XUkWklf0fRzk",
  authDomain: "cs4--s1.firebaseapp.com",
  projectId: "cs4--s1",
  storageBucket: "cs4--s1.appspot.com",
  messagingSenderId: "142025785856",
  appId: "1:142025785856:web:3c43c8dbe75e9014260ee5",
  measurementId: "G-B96T77HJWW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);
