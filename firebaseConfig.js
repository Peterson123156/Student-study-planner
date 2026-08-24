import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCDvbEQO1_moLrkYCYZrUpbtODXctXa-ss",
  authDomain: "studyflow-8add1.firebaseapp.com",
  projectId: "studyflow-8add1",
  storageBucket: "studyflow-8add1.firebasestorage.app",
  messagingSenderId: "809255887815",
  appId: "1:809255887815:web:bbf697ee87cc0db6ce2fe2",
  measurementId: "G-0E5HM4Y19D"
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();