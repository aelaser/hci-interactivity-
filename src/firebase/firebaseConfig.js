// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCwF0Xq-ox6HAjunKXqlQuYuuzIxPJJNPU",
    authDomain: "hci-interactivity-1cad7.firebaseapp.com",
    databaseURL: "https://hci-interactivity-1cad7-default-rtdb.firebaseio.com",
    projectId: "hci-interactivity-1cad7",
    storageBucket: "hci-interactivity-1cad7.appspot.com",
    messagingSenderId: "100531339097",
    appId: "1:100531339097:web:7c407eb116424a7855d648"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const database = getDatabase(app);
