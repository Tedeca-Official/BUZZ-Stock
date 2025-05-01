
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKh-fyOvw3ad9K7gZ0cDQgtX3I3YiAHXg",
  authDomain: "stocksavvy-app.firebaseapp.com",
  projectId: "stocksavvy-app",
  storageBucket: "stocksavvy-app.appspot.com",
  messagingSenderId: "850522734381",
  appId: "1:850522734381:web:33c43c834e6aa72c5da42c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
