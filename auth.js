// Method in Motion — Firebase Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCq3ag8O8i2Z7CZdcFCwsPnZu73e4ZdTPQ",
  authDomain: "method-in-motion.firebaseapp.com",
  projectId: "method-in-motion",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export function openAuthModal(mode = "login") {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  switchTab(mode);
}

export function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
  clearErrors();
}

function switchTab(mode) {
  document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
  document.querySelector(`.auth-tab[data-tab="${mode}"]`)?.classList.add("active");
  document.getElementById(`${mode}-form`)?.classList.add("active");
}

function clearErrors() {
  document.querySelectorAll(".auth-error").forEach(el => el.textContent = "");
}

function showError(formId, message) {
  const el = document.querySelector(`#${formId} .auth-error`);
  if (el) el.textContent = message;
}

export async function signUp(email, password, displayName) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", result.user.uid), {
      email, displayName, tier: "free",
      createdAt: new Date().toISOString(),
    });
    closeAuthModal();
    // Use the typed display name directly
    setNavUser(displayName);
  } catch (err) {
    showError("signup-form", friendlyError(err.code));
  }
}

export async function signIn(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Load display name from Firestore
    const snap = await getDoc(doc(db, "users", result.user.uid));
    const displayName = snap.exists() ? snap.data().displayName : result.user.email.split("@")[0];
    closeAuthModal();
    setNavUser(displayName);
    const tier = snap.exists() ? snap.data().tier : "free";
    unlockContent(tier);
  } catch (err) {
    showError("login-form", friendlyError(err.code));
  }
}

export async function logOut() {
  await signOut(auth);
  setNavUser(null);
}

export async function getUserTier(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) return snap.data().tier;
  } catch(e) {}
  return "free";
}

export function initAuth() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const snap = await getDoc(doc(db, "users", user.uid));
      const displayName = snap.exists() ? snap.data().displayName : user.email.split("@")[0];
      const tier = snap.exists() ? snap.data().tier : "free";
      setNavUser(displayName);
      unlockContent(tier);
    } else {
      setNavUser(null);
    }
  });
}

function setNavUser(displayName) {
  const isLoggedIn = !!displayName;
  document.querySelectorAll("[data-auth='login'], [data-auth='signup']").forEach(btn => {
    btn.style.display = isLoggedIn ? "none" : "";
  });
  const userMenu = document.getElementById("nav-user-menu");
  const userName = document.getElementById("nav-user-name");
  const logoutBtn = document.getElementById("nav-logout-btn");
  if (userMenu) userMenu.style.display = isLoggedIn ? "flex" : "none";
  if (userName) userName.textContent = displayName || "";
  if (logoutBtn) logoutBtn.onclick = () => logOut();
}

export function unlockContent(tier) {
  const tiers = { free: 0, sparks: 1, builders: 2, coders: 3 };
  const userLevel = tiers[tier] || 0;
  document.querySelectorAll(".locked-section").forEach(el => {
    const required = tiers[el.dataset.tier] || 1;
    if (userLevel >= required) {
     el.classList.remove("locked-section");
el.classList.add("unlocked-section");
      const lock = el.querySelector(".lock-overlay");
      if (lock) lock.remove();
    }
  });
}

function friendlyError(code) {
  const errors = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/invalid-credential": "Incorrect email or password.",
  };
  return errors[code] || "Something went wrong. Please try again.";
}
