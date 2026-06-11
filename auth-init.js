import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCq3ag8O8i2Z7CZdcFCwsPnZu73e4ZdTPQ",
  authDomain: "method-in-motion.firebaseapp.com",
  projectId: "method-in-motion",
  storageBucket: "method-in-motion.firebasestorage.app",
  messagingSenderId: "1067937974009",
  appId: "1:1067937974009:web:5b21e6abe84e0b28234428"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  const nameEl    = document.getElementById("nav-user-name");
  const userMenu  = document.getElementById("nav-user-menu");
  const logoutBtn = document.getElementById("nav-logout-btn");
  const loginBtn  = document.getElementById("nav-login");

  if (user) {
    const userDoc  = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    const userTier = userData.tier || "none";

    // Show user name + logout, hide login button
    if (nameEl)   nameEl.textContent = userData.displayName || user.email;
    if (userMenu) userMenu.style.display = "flex";
    if (loginBtn) loginBtn.style.display = "none";

    // Fire the per-page unlock function if it exists
    if (typeof window.handleTierUnlock === "function") {
      window.handleTierUnlock(userTier);
    }

  } else {
    // Logged out — show login button, hide user menu
    if (nameEl)   nameEl.textContent = "";
    if (userMenu) userMenu.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
  }
});

// Logout button
document.getElementById("nav-logout-btn")?.addEventListener("click", () => {
  signOut(auth);
});

// Login/Signup form handlers
document.getElementById("login-submit-btn")?.addEventListener("click", async () => {
  const { getAuth, signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl  = document.getElementById("login-error");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("auth-modal").style.display = "none";
  } catch (err) {
    if (errorEl) errorEl.textContent = "Incorrect email or password.";
  }
});

document.getElementById("signup-submit-btn")?.addEventListener("click", async () => {
  const { createUserWithEmailAndPassword, updateProfile } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
  const { setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  const name     = document.getElementById("signup-name").value.trim();
  const email    = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const errorEl  = document.getElementById("signup-error");
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, "users", cred.user.uid), {
      displayName: name,
      email: email,
      tier: "none",
      createdAt: new Date().toISOString()
    });
    document.getElementById("auth-modal").style.display = "none";
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message || "Something went wrong.";
  }
});
