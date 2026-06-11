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

const TIER_LEVELS = { sparks: 1, builders: 2, coders: 3 };

onAuthStateChanged(auth, async (user) => {
  const nameEl = document.getElementById("nav-user-name");
  const logoutBtn = document.getElementById("nav-logout");
  const loginBtn = document.getElementById("nav-login");

  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    const userTier = userData.tier || "none";

    if (nameEl) nameEl.textContent = userData.displayName || user.email;
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";

    document.querySelectorAll(".locked-section").forEach((section) => {
      const requiredTier = section.getAttribute("data-tier");
      const userLevel = TIER_LEVELS[userTier] || 0;
      const requiredLevel = TIER_LEVELS[requiredTier] || 999;

      if (userLevel >= requiredLevel) {
        section.classList.add("unlocked");
        const lockedCards = section.querySelector(".locked-cards");
        const lockedLabel = section.querySelector(".locked-label");
        const joinPrompt = section.querySelector(".join-prompt");
        if (lockedCards) lockedCards.style.display = "none";
        if (lockedLabel) lockedLabel.style.display = "none";
        if (joinPrompt) joinPrompt.style.display = "none";
      }
    });

  } else {
    if (nameEl) nameEl.textContent = "";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
  }
});

document.getElementById("nav-logout")?.addEventListener("click", () => {
  signOut(auth);
});
