import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSXbkZGVMdECqHREBq6Vn9ySGk8TS30dk",
  authDomain: "method-in-motion.firebaseapp.com",
  projectId: "method-in-motion",
  storageBucket: "method-in-motion.appspot.com",
  messagingSenderId: "1086946512876",
  appId: "1:1086946512876:web:b7e44f1c1e5e4e4e4e4e4e"
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

    // Unlock locked sections
    document.querySelectorAll(".locked-section").forEach((section) => {
      const requiredTier = section.getAttribute("data-tier");
      const userLevel = TIER_LEVELS[userTier] || 0;
      const requiredLevel = TIER_LEVELS[requiredTier] || 999;

      if (userLevel >= requiredLevel) {
        section.classList.add("unlocked");
        section.querySelector(".locked-cards")?.style.setProperty("display", "none");
        section.querySelector(".locked-label")?.style.setProperty("display", "none");
        section.querySelector(".join-prompt")?.style.setProperty("display", "none");
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
