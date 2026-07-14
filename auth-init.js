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

const authModal = document.getElementById("auth-modal");

function openAuthModal(tab) {
  if (!authModal) return;
  authModal.classList.add("active");
  authModal.style.display = "flex";
  if (tab) setAuthTab(tab);
}

// Closes the auth modal regardless of which technique a given page uses to
// show/hide it (some pages use a CSS "active" class, others toggle the
// inline display style directly). Handling both here means this single
// function works everywhere without having to touch every page's markup.
function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.remove("active");
  authModal.style.display = "none";
}

function setAuthTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  document.getElementById("login-form")?.classList.toggle("active", tab === "login");
  document.getElementById("signup-form")?.classList.toggle("active", tab === "signup");
  if (document.getElementById("login-form")) {
    document.getElementById("login-form").style.display = tab === "login" ? "block" : "none";
  }
  if (document.getElementById("signup-form")) {
    document.getElementById("signup-form").style.display = tab === "signup" ? "block" : "none";
  }
}

// Self-contained success toast. Built with inline styles (not page CSS
// classes) so it renders consistently no matter which page/template it
// fires on.
function showWelcomeToast(message) {
  const existing = document.getElementById("mim-welcome-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "mim-welcome-toast";
  toast.style.cssText = `
    position:fixed;
    top:24px;
    left:50%;
    transform:translateX(-50%) translateY(-20px);
    z-index:99999;
    background:linear-gradient(135deg,#ff6baa,#c66bff,#00e8ff);
    color:#000;
    font-family:'Orbitron',monospace;
    font-size:.72rem;
    letter-spacing:.08em;
    font-weight:700;
    padding:14px 26px;
    border-radius:100px;
    box-shadow:0 10px 40px rgba(198,107,255,.45);
    opacity:0;
    transition:opacity .35s ease, transform .35s ease;
    text-align:center;
    max-width:90vw;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(-20px)";
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}

onAuthStateChanged(auth, async (user) => {
  const nameEl = document.getElementById("nav-username");
  const userMenu = document.getElementById("nav-user-menu");
  const loginBtn = document.getElementById("nav-login");
  const joinBtn = document.getElementById("nav-join");

  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    const userTier = userData.tier || "none";
    if (nameEl) nameEl.textContent = userData.displayName || user.email;
    if (userMenu) userMenu.style.display = "flex";
    if (loginBtn) loginBtn.style.display = "none";
    if (joinBtn) joinBtn.style.display = "none";
    if (typeof window.handleTierUnlock === "function") { window.handleTierUnlock(userTier); }
  } else {
    if (nameEl) nameEl.textContent = "";
    if (userMenu) userMenu.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (joinBtn) joinBtn.style.display = "inline-block";
  }
});

// Open modal
document.getElementById("nav-login")?.addEventListener("click", (e) => {
  e.preventDefault();
  openAuthModal("login");
});
document.getElementById("nav-join")?.addEventListener("click", (e) => {
  e.preventDefault();
  openAuthModal("signup");
});

// Close modal
document.getElementById("auth-close-btn")?.addEventListener("click", closeAuthModal);
authModal?.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuthModal();
});

// Tab switching (top tabs + inline "switch" links)
document.querySelectorAll(".auth-tab, .auth-link").forEach((el) => {
  el.addEventListener("click", () => setAuthTab(el.dataset.tab));
});

// Logout
document.getElementById("nav-logout-btn")?.addEventListener("click", () => { signOut(auth); });

// Login submit
document.getElementById("login-submit-btn")?.addEventListener("click", async () => {
  const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    closeAuthModal();
    const userDoc = await getDoc(doc(db, "users", cred.user.uid));
    const displayName = userDoc.exists() ? (userDoc.data().displayName || "") : "";
    showWelcomeToast(displayName ? `Welcome back, ${displayName}! ✦` : "Welcome back! ✦");
  } catch (err) {
    if (errorEl) errorEl.textContent = "Incorrect email or password.";
  }
});

// Signup submit
document.getElementById("signup-submit-btn")?.addEventListener("click", async () => {
  const { createUserWithEmailAndPassword, updateProfile } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
  const { setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const errorEl = document.getElementById("signup-error");
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, "users", cred.user.uid), {
      displayName: name,
      email: email,
      tier: "none",
      createdAt: new Date().toISOString()
    });
    closeAuthModal();
    showWelcomeToast(`Welcome to the crew, ${name}! ✦`);
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message || "Something went wrong.";
  }
});
