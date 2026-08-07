import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// ─── SHARED CHARACTER ACCESS SYSTEM ─────────────────────────────────────────
// One source of truth for which tier unlocks which character's lessons/game/
// cheat sheet. Every character page should call window.mimHasAccess(charId,
// tier, kind, lessonNum) instead of writing its own tier-comparison logic.
//
// kind is 'lessons', 'game', or 'cheat'.
// `lessons` is normally a flat tier string (same tier unlocks every lesson),
// but can instead be an object keyed by lesson number when a character has
// per-lesson gating (currently only Zen: Lesson 1 free, Lessons 2-4 Sparks).
// Pass lessonNum when checking a specific lesson on a per-lesson character.
//
// Cheat sheet tier = the tier of the DEEPEST lesson content it summarizes,
// not a blanket rule — e.g. Zen's cheat sheet covers Lessons 1-4, and since
// Lessons 2-4 are Sparks, the cheat sheet is Sparks even though Lesson 1
// itself is free.
const CHARACTER_ACCESS = {
  zen:  {
    lessons: { 1: "explorer", 2: "sparks", 3: "sparks", 4: "sparks" },
    game: "sparks",
    cheat: "sparks"
  },
  byte: {
    lessons: "coders",
    game: "explorer",
    cheat: "coders"
  },
  bug: {
    lessons: "sparks",
    game: "sparks",
    cheat: "sparks"
  },
  echo: {
    lessons: "sparks",
    game: "sparks",
    cheat: "sparks"
  },
  loop: {
    lessons: "coders",
    game: "coders",
    cheat: "coders"
  },
  nova: {
    lessons: "coders",
    game: "coders",
    cheat: "coders"
  }
};

// Free/paid gating for content that isn't scoped to a single character —
// Comics, Broken Syntax, Tag Wall, the background creator, etc. Keeps this
// logic out of dashboard.html/games.html/index.html so every page reads
// from the same source instead of hardcoding its own tier checks.
const SITE_FEATURES = {
  comics: "explorer",
  brokenSyntax: "explorer",
  tagWall: "explorer",
  backgroundCreator: "explorer"
};

const TIER_RANK = {
  explorer: 1,
  sparks: 2,
  coders: 3
};

function mimHasAccess(charId, tier, kind, lessonNum) {
  const rules = CHARACTER_ACCESS[charId];
  if (!rules) return false;

  let required = rules[kind];

  if (kind === "lessons" && required && typeof required === "object") {
    if (lessonNum != null) {
      required = required[lessonNum];
    } else {
      // No specific lesson requested — default to the most restrictive
      // tier among this character's lessons so nothing leaks unlocked.
      required = Object.values(required).reduce(
        (highest, t) => (
          TIER_RANK[t] > TIER_RANK[highest] ? t : highest
        ),
        "explorer"
      );
    }
  }

  required = required || "coders";

  const userRank =
    TIER_RANK[(tier || "").toLowerCase()] || 0;

  const requiredRank =
    TIER_RANK[required] || 99;

  return userRank >= requiredRank;
}

function mimHasFeatureAccess(featureKey, tier) {
  const required = SITE_FEATURES[featureKey];

  if (!required) return false;

  const userRank =
    TIER_RANK[(tier || "").toLowerCase()] || 0;

  const requiredRank =
    TIER_RANK[required] || 99;

  return userRank >= requiredRank;
}

window.mimCharacterAccess = CHARACTER_ACCESS;
window.mimSiteFeatures = SITE_FEATURES;
window.mimHasAccess = mimHasAccess;
window.mimHasFeatureAccess = mimHasFeatureAccess;

// ─────────────────────────────────────────────────────────────────────────────

const authModal = document.getElementById("auth-modal");
let authActionInProgress = false;

function setError(id, message = "") {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = message;
  el.classList.toggle("visible", Boolean(message));
}

function setStatus(id, message = "") {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = message;
  el.classList.toggle("visible", Boolean(message));
}

function setButtonBusy(button, busy, busyText, normalText) {
  if (!button) return;

  button.disabled = busy;
  button.textContent = busy ? busyText : normalText;
}

function friendlyAuthError(error, action) {
  const code = error?.code || "";

  if (code === "auth/email-already-in-use") {
    return "That email already has an account. Try logging in instead.";
  }

  if (code === "auth/invalid-email") {
    return "Enter a valid email address.";
  }

  if (code === "auth/weak-password") {
    return "Your password must contain at least six characters.";
  }

  if (code === "auth/missing-password") {
    return "Enter your password.";
  }

  if (
    code === "auth/invalid-credential" ||
    code === "auth/wrong-password" ||
    code === "auth/user-not-found"
  ) {
    return "The email or password is incorrect.";
  }

  if (code === "auth/too-many-requests") {
    return "Too many attempts. Wait a moment and try again.";
  }

  if (code === "auth/network-request-failed") {
    return "We could not reach the server. Check your connection and try again.";
  }

  return action === "signup"
    ? "We could not finish creating your account. Please try again."
    : "We could not log you in. Please try again.";
}

function openAuthModal(tab) {
  if (!authModal) return;

  authModal.classList.add("active");
  authModal.style.display = "flex";

  if (tab) {
    setAuthTab(tab);
  }
}

function closeAuthModal() {
  if (!authModal || authActionInProgress) return;

  authModal.classList.remove("active");
  authModal.style.display = "none";
}

function setAuthTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  loginForm?.classList.toggle("active", tab === "login");
  signupForm?.classList.toggle("active", tab === "signup");

  if (loginForm) {
    loginForm.style.display = tab === "login" ? "block" : "none";
  }

  if (signupForm) {
    signupForm.style.display = tab === "signup" ? "block" : "none";
  }

  setError("login-error");
  setError("signup-error");
  setStatus("login-status");
  setStatus("signup-status");
}

function showWelcomeToast(message) {
  document.getElementById("mim-welcome-toast")?.remove();

  const toast = document.createElement("div");

  toast.id = "mim-welcome-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

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
}

async function readUserProfile(uid) {
  try {
    const snap = await getDoc(
      doc(db, "users", uid)
    );

    return snap.exists()
      ? snap.data()
      : {};
  } catch (error) {
    console.error(
      "Could not read user profile:",
      error
    );

    return {};
  }
}

function redirectToDashboard(delay = 1100) {
  window.setTimeout(() => {
    window.location.assign("dashboard.html");
  }, delay);
}

onAuthStateChanged(auth, async (user) => {
  const nameEl =
    document.getElementById("nav-username");

  const userMenu =
    document.getElementById("nav-user-menu");

  const authButtons =
    document.getElementById("nav-auth-btns");

  const loginBtn =
    document.getElementById("nav-login");

  const joinBtn =
    document.getElementById("nav-join");

  if (user) {
    const userData =
      await readUserProfile(user.uid);

    const userTier =
      userData.tier || "explorer";

    if (nameEl) {
      nameEl.textContent =
        userData.displayName ||
        user.displayName ||
        user.email;
    }

    if (userMenu) {
      userMenu.style.display = "flex";
    }

    if (authButtons) {
      authButtons.style.display = "none";
    }

    if (loginBtn) {
      loginBtn.style.display = "none";
    }

    if (joinBtn) {
      joinBtn.style.display = "none";
    }

    if (
      typeof window.handleTierUnlock === "function"
    ) {
      window.handleTierUnlock(userTier);
    }
  } else {
    if (nameEl) {
      nameEl.textContent = "";
    }

    if (userMenu) {
      userMenu.style.display = "none";
    }

    if (authButtons) {
      authButtons.style.display = "flex";
    }

    if (loginBtn) {
      loginBtn.style.display = "inline-block";
    }

    if (joinBtn) {
      joinBtn.style.display = "inline-block";
    }
  }
});

document
  .getElementById("nav-login")
  ?.addEventListener("click", (event) => {
    event.preventDefault();
    openAuthModal("login");
  });

document
  .getElementById("nav-join")
  ?.addEventListener("click", (event) => {
    event.preventDefault();

    sessionStorage.setItem(
      "mimSelectedPlan",
      "explorer"
    );

    openAuthModal("signup");
  });

document
  .getElementById("auth-close-btn")
  ?.addEventListener(
    "click",
    closeAuthModal
  );

authModal?.addEventListener(
  "click",
  (event) => {
    if (event.target === authModal) {
      closeAuthModal();
    }
  }
);

document
  .querySelectorAll(".auth-tab, .auth-link")
  .forEach((element) => {
    element.addEventListener(
      "click",
      () => setAuthTab(element.dataset.tab)
    );
  });

document
  .getElementById("nav-logout-btn")
  ?.addEventListener(
    "click",
    async () => {
      await signOut(auth);
      window.location.assign("index.html");
    }
  );

async function handleLogin() {
  if (authActionInProgress) return;

  const button =
    document.getElementById(
      "login-submit-btn"
    );

  const email =
    document
      .getElementById("login-email")
      ?.value.trim() || "";

  const password =
    document
      .getElementById("login-password")
      ?.value || "";

  setError("login-error");
  setStatus("login-status");

  if (!email || !password) {
    setError(
      "login-error",
      "Enter both your email and password."
    );

    return;
  }

  authActionInProgress = true;

  setButtonBusy(
    button,
    true,
    "Logging In…",
    "Log In"
  );

  try {
    const credential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const userData =
      await readUserProfile(
        credential.user.uid
      );

    const displayName =
      userData.displayName ||
      credential.user.displayName ||
      "";

    setStatus(
      "login-status",
      "Login successful. Loading your dashboard…"
    );

    showWelcomeToast(
      displayName
        ? `Welcome back, ${displayName}! ✦`
        : "Welcome back! ✦"
    );

    authModal?.classList.remove("active");

    if (authModal) {
      authModal.style.display = "none";
    }

    redirectToDashboard();
  } catch (error) {
    console.error(
      "Login failed:",
      error
    );

    setError(
      "login-error",
      friendlyAuthError(
        error,
        "login"
      )
    );
  } finally {
    authActionInProgress = false;

    setButtonBusy(
      button,
      false,
      "Logging In…",
      "Log In"
    );
  }
}

async function handleSignup() {
  if (authActionInProgress) return;

  const button =
    document.getElementById(
      "signup-submit-btn"
    );

  const name =
    document
      .getElementById("signup-name")
      ?.value.trim() || "";

  const email =
    document
      .getElementById("signup-email")
      ?.value.trim() || "";

  const password =
    document
      .getElementById("signup-password")
      ?.value || "";

  const selectedPlan =
    sessionStorage.getItem(
      "mimSelectedPlan"
    ) || "explorer";

  setError("signup-error");
  setStatus("signup-status");

  if (!name) {
    setError(
      "signup-error",
      "Enter the name you want the crew to call you."
    );

    return;
  }

  if (!email) {
    setError(
      "signup-error",
      "Enter your email address."
    );

    return;
  }

  if (password.length < 6) {
    setError(
      "signup-error",
      "Your password must contain at least six characters."
    );

    return;
  }

  authActionInProgress = true;

  setButtonBusy(
    button,
    true,
    "Creating Account…",
    "Create Your Account"
  );

  try {
    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    await updateProfile(
      credential.user,
      {
        displayName: name
      }
    );

    try {
      await setDoc(
        doc(
          db,
          "users",
          credential.user.uid
        ),
        {
          displayName: name,
          email,
          tier: "explorer",
          selectedPlan,
          createdAt:
            new Date().toISOString()
        },
        {
          merge: true
        }
      );
    } catch (profileError) {
      console.error(
        "Account created, but Firestore profile save failed:",
        profileError
      );

      setStatus(
        "signup-status",
        "Your account was created. We are loading your dashboard, but some profile details may need to sync."
      );
    }

    showWelcomeToast(
      `Welcome to the crew, ${name}! ✦`
    );

    sessionStorage.setItem(
      "mimPostSignupPlan",
      selectedPlan
    );

    authModal?.classList.remove(
      "active"
    );

    if (authModal) {
      authModal.style.display = "none";
    }

    redirectToDashboard();
  } catch (error) {
    console.error(
      "Signup failed:",
      error
    );

    setError(
      "signup-error",
      friendlyAuthError(
        error,
        "signup"
      )
    );
  } finally {
    authActionInProgress = false;

    setButtonBusy(
      button,
      false,
      "Creating Account…",
      "Create Your Account"
    );
  }
}

document
  .getElementById("login-submit-btn")
  ?.addEventListener(
    "click",
    handleLogin
  );

document
  .getElementById("signup-submit-btn")
  ?.addEventListener(
    "click",
    handleSignup
  );

document
  .getElementById("login-password")
  ?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    }
  );

document
  .getElementById("signup-password")
  ?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        handleSignup();
      }
    }
  );

// Keep the page's existing inline openModal calls working.
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;