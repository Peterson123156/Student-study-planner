import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDvbEQO1_moLrkYCYZrUpbtODXctXa-ss",
  authDomain: "studyflow-8add1.firebaseapp.com",
  projectId: "studyflow-8add1",
  storageBucket: "studyflow-8add1.firebasestorage.app",
  messagingSenderId: "809255887815",
  appId: "1:809255887815:web:bbf697ee87cc0db6ce2fe2",
  measurementId: "G-0E5HM4Y19D"
};

// Initialize Services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btn-login");
  const btnLogout = document.getElementById("btn-logout");
  const userProfile = document.getElementById("user-profile");
  const userName = document.getElementById("user-name");
  const userAvatar = document.getElementById("user-avatar");

  // Sign In Handler
  btnLogin?.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign-in error:", error.message);
    }
  });

  // Sign Out Handler
  btnLogout?.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error.message);
    }
  });

  // Auth Observer State
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (userAvatar) userAvatar.src = user.photoURL || "https://via.placeholder.com/32";
      if (userName) userName.textContent = user.displayName || user.email;

      btnLogin?.classList.add("hidden");
      userProfile?.classList.remove("hidden");
    } else {
      if (userAvatar) userAvatar.src = "";
      if (userName) userName.textContent = "";

      userProfile?.classList.add("hidden");
      btnLogin?.classList.remove("hidden");
    }
  });
});