// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDK4SmGtc07BiLvjmkm7hYINOynDbZtsB4",
  authDomain: "tartan-hacks.firebaseapp.com",
  databaseURL: "https://tartan-hacks-default-rtdb.firebaseio.com",
  projectId: "tartan-hacks",
  storageBucket: "tartan-hacks.firebasestorage.app",
  messagingSenderId: "502416108052",
  appId: "1:502416108052:web:349d21135012435c089501",
  measurementId: "G-QE35TBJXE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };