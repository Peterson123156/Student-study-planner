import { auth, provider } from "./firebaseConfig.js";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// UI Elements
const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");
const userProfile = document.getElementById("user-profile");
const userName = document.getElementById("user-name");
const userAvatar = document.getElementById("user-avatar");

// Step 3: Authentication Handlers
btnLogin?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Sign-in failed:", error.message);
  }
});

btnLogout?.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out failed:", error.message);
  }
});

// Step 4: State Listener (Syncs UI on login/logout/reload)
onAuthStateChanged(auth, (user) => {
  if (user) {
    userAvatar.src = user.photoURL || "https://via.placeholder.com/32";
    userName.textContent = user.displayName || user.email;

    btnLogin.classList.add("hidden");
    userProfile.classList.remove("hidden");
  } else {
    userAvatar.src = "";
    userName.textContent = "";

    userProfile.classList.add("hidden");
    btnLogin.classList.remove("hidden");
  }
});