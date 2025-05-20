// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUzC3nWvsXNvaBUgKemIOOOWizz2EfA3E",
  authDomain: "se4458-ai-agent-chat.firebaseapp.com",
  databaseURL: "https://se4458-ai-agent-chat-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "se4458-ai-agent-chat",
  storageBucket: "se4458-ai-agent-chat.firebasestorage.app",
  messagingSenderId: "42118526183",
  appId: "1:42118526183:web:7e76ada702f0a3e1141e42",
  measurementId: "G-XMD8ZFZ0BY"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
