// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcAlhV63MMUZw-74uDulZb2Xt1uCS976c",
  authDomain: "cheekypups-42685.firebaseapp.com",
  projectId: "cheekypups-42685",
  storageBucket: "cheekypups-42685.appspot.com",
  messagingSenderId: "881040537537",
  appId: "1:881040537537:web:667884b78a7f19c8caa140",
  measurementId: "G-4YHKXD2PGG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);