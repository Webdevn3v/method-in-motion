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

const authModal = document.getElementById("auth-modal");

let authActionInProgress = false;


/*
  CHARACTER ACCESS

  Explorer:
  - Zen

  Sparks:
  - Zen
  - Bug
  - Echo

  Coders:
  - Zen
  - Bug
  - Echo
  - Byte
  - Loop
  - Nova
*/
const CHARACTER_ACCESS = {
  zen: {
    tiers: ["explorer", "sparks", "coders"],
    requiredPlan: "Explorer",
    characterName: "Zen"
  },

  bug: {
    tiers: ["sparks", "coders"],
    requiredPlan: "Sparks",
    characterName: "Bug"
  },

  echo: {
    tiers: ["sparks", "coders"],
    requiredPlan: "Sparks",
    characterName: "Echo"
  },

  byte: {
    tiers: ["coders"],
    requiredPlan: "Coders",
    characterName: "Byte"
  },

  loop: {
    tiers: ["coders"],
    requiredPlan: "Coders",
    characterName: "Loop"
  },

  nova: {
    tiers: ["coders"],
    requiredPlan: "Coders",
    characterName: "Nova"
  }
};


const currentPage = window.location.pathname
  .split("/")
  .pop()
  .replace(/\.html$/i, "")
  .toLowerCase();

const currentCharacter = CHARACTER_ACCESS[currentPage] || null;


function normalizeTier(value) {
  const tier = String(value || "explorer")
    .trim()
    .toLowerCase();

  return tier === "free"
    ? "explorer"
    : tier;
}


function removeCharacterLock() {
  document
    .getElementById("mim-character-lock")
    ?.remove();

  document.body.style.overflow = "";
}


function showCharacterLock({
  characterName,
  requiredPlan,
  signedOut = false
}) {
  removeCharacterLock();

  const overlay = document.createElement("div");

  overlay.id = "mim-character-lock";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    z-index:999999;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
    background:rgba(3,5,10,.78);
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
  `;


  const card = document.createElement("div");

  card.style.cssText = `
    width:min(520px, 94vw);
    border:1px solid rgba(0,232,255,.42);
    border-radius:20px;
    padding:34px 28px;
    text-align:center;
    background:
      linear-gradient(
        145deg,
        rgba(15,18,32,.98),
        rgba(7,10,19,.98)
      );
    box-shadow:
      0 0 45px rgba(0,232,255,.18),
      0 24px 80px rgba(0,0,0,.55);
    color:#fff;
  `;


  const eyebrow = document.createElement("div");

  eyebrow.style.cssText = `
    font-family:'Space Mono',monospace;
    font-size:.68rem;
    letter-spacing:.17em;
    text-transform:uppercase;
    color:#00e8ff;
    margin-bottom:14px;
  `;

  eyebrow.textContent = signedOut
    ? "Membership required"
    : "Upgrade required";


  const title = document.createElement("h2");

  title.style.cssText = `
    margin:0 0 12px;
    font-family:'Orbitron',sans-serif;
    font-size:clamp(1.35rem,4vw,2rem);
    line-height:1.2;
    color:#fff;
  `;

  title.textContent = signedOut
    ? `Join to unlock ${characterName}'s world`
    : `Upgrade to ${requiredPlan} to unlock ${characterName}`;


  const message = document.createElement("p");

  message.style.cssText = `
    margin:0 auto 24px;
    max-width:410px;
    font-family:'Space Grotesk',sans-serif;
    font-size:.95rem;
    line-height:1.65;
    color:rgba(255,255,255,.72);
  `;

  message.textContent = signedOut
    ? `Create an Explorer account or log in to see which character worlds are included with your membership.`
    : `${characterName}'s lessons are not included with your current membership. The world stays visible, but the learning content remains locked.`;


  const buttonRow = document.createElement("div");

  buttonRow.style.cssText = `
    display:flex;
    justify-content:center;
    gap:12px;
    flex-wrap:wrap;
  `;


  const primaryButton = document.createElement("a");

  primaryButton.href = "membership.html";

  primaryButton.style.cssText = `
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-width:180px;
    padding:13px 20px;
    border-radius:999px;
    text-decoration:none;
    font-family:'Orbitron',sans-serif;
    font-size:.75rem;
    font-weight:700;
    letter-spacing:.06em;
    color:#05070d;
    background:linear-gradient(
      135deg,
      #00e8ff,
      #b8ff3c
    );
    box-shadow:0 0 24px rgba(0,232,255,.28);
  `;

  primaryButton.textContent = signedOut
    ? "View Memberships"
    : `Upgrade to ${requiredPlan}`;


  buttonRow.appendChild(primaryButton);


  if (signedOut) {
    const loginButton = document.createElement("button");

    loginButton.type = "button";

    loginButton.style.cssText = `
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-width:140px;
      padding:13px 20px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.24);
      background:rgba(255,255,255,.05);
      color:#fff;
      font-family:'Orbitron',sans-serif;
      font-size:.75rem;
      font-weight:700;
      letter-spacing:.06em;
      cursor:pointer;
    `;

    loginButton.textContent = "Log In";

    loginButton.addEventListener("click", () => {
      if (authModal) {
        openAuthModal("login");
        return;
      }

      window.location.assign("index.html");
    });

    buttonRow.appendChild(loginButton);
  }


  card.appendChild(eyebrow);
  card.appendChild(title);
  card.appendChild(message);
  card.appendChild(buttonRow);

  overlay.appendChild(card);

  document.body.appendChild(overlay);

  document.body.style.overflow = "hidden";
}


function setError(id, message = "") {
  const el = document.getElementById(id);

  if (!el) return;

  el.textContent = message;

  el.classList.toggle(
    "visible",
    Boolean(message)
  );
}


function setStatus(id, message = "") {
  const el = document.getElementById(id);

  if (!el) return;

  el.textContent = message;

  el.classList.toggle(
    "visible",
    Boolean(message)
  );
}


function setButtonBusy(
  button,
  busy,
  busyText,
  normalText
) {
  if (!button) return;

  button.disabled = busy;

  button.textContent = busy
    ? busyText
    : normalText;
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
  if (!authModal || authActionInProgress) {
    return;
  }

  authModal.classList.remove("active");
  authModal.style.display = "none";
}


function setAuthTab(tab) {
  document
    .querySelectorAll(".auth-tab")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.tab === tab
      );
    });


  const loginForm =
    document.getElementById("login-form");

  const signupForm =
    document.getElementById("signup-form");


  loginForm?.classList.toggle(
    "active",
    tab === "login"
  );

  signupForm?.classList.toggle(
    "active",
    tab === "signup"
  );


  if (loginForm) {
    loginForm.style.display =
      tab === "login"
        ? "block"
        : "none";
  }


  if (signupForm) {
    signupForm.style.display =
      tab === "signup"
        ? "block"
        : "none";
  }


  setError("login-error");
  setError("signup-error");

  setStatus("login-status");
  setStatus("signup-status");
}


function showWelcomeToast(message) {
  document
    .getElementById("mim-welcome-toast")
    ?.remove();


  const toast =
    document.createElement("div");


  toast.id = "mim-welcome-toast";

  toast.setAttribute(
    "role",
    "status"
  );

  toast.setAttribute(
    "aria-live",
    "polite"
  );


  toast.style.cssText = `
    position:fixed;
    top:24px;
    left:50%;
    transform:
      translateX(-50%)
      translateY(-20px);
    z-index:99999;
    background:
      linear-gradient(
        135deg,
        #ff6baa,
        #c66bff,
        #00e8ff
      );
    color:#000;
    font-family:'Orbitron',monospace;
    font-size:.72rem;
    letter-spacing:.08em;
    font-weight:700;
    padding:14px 26px;
    border-radius:100px;
    box-shadow:
      0 10px 40px
      rgba(198,107,255,.45);
    opacity:0;
    transition:
      opacity .35s ease,
      transform .35s ease;
    text-align:center;
    max-width:90vw;
  `;


  toast.textContent = message;

  document.body.appendChild(toast);


  requestAnimationFrame(() => {
    toast.style.opacity = "1";

    toast.style.transform =
      "translateX(-50%) translateY(0)";
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
    window.location.assign(
      "dashboard.html"
    );
  }, delay);
}


onAuthStateChanged(
  auth,
  async (user) => {
    const nameEl =
      document.getElementById(
        "nav-username"
      );

    const userMenu =
      document.getElementById(
        "nav-user-menu"
      );

    const authButtons =
      document.getElementById(
        "nav-auth-btns"
      );

    const loginBtn =
      document.getElementById(
        "nav-login"
      );

    const joinBtn =
      document.getElementById(
        "nav-join"
      );


    if (user) {
      const userData =
        await readUserProfile(
          user.uid
        );


      const userTier =
        normalizeTier(
          userData.tier ||
          userData.plan ||
          userData.selectedPlan ||
          "explorer"
        );


      if (
        currentCharacter &&
        !currentCharacter.tiers.includes(
          userTier
        )
      ) {
        showCharacterLock({
          characterName:
            currentCharacter.characterName,

          requiredPlan:
            currentCharacter.requiredPlan,

          signedOut: false
        });
      } else {
        removeCharacterLock();
      }


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
        typeof window.setNavUser ===
        "function"
      ) {
        window.setNavUser(
          user.email ||
          userData.email ||
          ""
        );
      }


      /*
        Only unlock lessons when the member
        actually has access to this character.
      */
      const canAccessCharacter =
        !currentCharacter ||
        currentCharacter.tiers.includes(
          userTier
        );


      if (
        canAccessCharacter &&
        typeof window.handleTierUnlock ===
          "function"
      ) {
        window.handleTierUnlock(
          userTier
        );
      }
    } else {
      if (currentCharacter) {
        showCharacterLock({
          characterName:
            currentCharacter.characterName,

          requiredPlan:
            currentCharacter.requiredPlan,

          signedOut: true
        });
      } else {
        removeCharacterLock();
      }


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
        loginBtn.style.display =
          "inline-block";
      }


      if (joinBtn) {
        joinBtn.style.display =
          "inline-block";
      }
    }
  }
);


document
  .getElementById("nav-login")
  ?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();

      openAuthModal("login");
    }
  );


document
  .getElementById("nav-join")
  ?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();

      sessionStorage.setItem(
        "mimSelectedPlan",
        "explorer"
      );

      openAuthModal("signup");
    }
  );


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
  .querySelectorAll(
    ".auth-tab, .auth-link"
  )
  .forEach((element) => {
    element.addEventListener(
      "click",
      () => {
        setAuthTab(
          element.dataset.tab
        );
      }
    );
  });


document
  .getElementById(
    "nav-logout-btn"
  )
  ?.addEventListener(
    "click",
    async () => {
      await signOut(auth);

      window.location.assign(
        "index.html"
      );
    }
  );


async function handleLogin() {
  if (authActionInProgress) {
    return;
  }


  const button =
    document.getElementById(
      "login-submit-btn"
    );


  const email =
    document
      .getElementById(
        "login-email"
      )
      ?.value.trim() || "";


  const password =
    document
      .getElementById(
        "login-password"
      )
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


    authModal?.classList.remove(
      "active"
    );


    if (authModal) {
      authModal.style.display =
        "none";
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
  if (authActionInProgress) {
    return;
  }


  const button =
    document.getElementById(
      "signup-submit-btn"
    );


  const name =
    document
      .getElementById(
        "signup-name"
      )
      ?.value.trim() || "";


  const email =
    document
      .getElementById(
        "signup-email"
      )
      ?.value.trim() || "";


  const password =
    document
      .getElementById(
        "signup-password"
      )
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
      authModal.style.display =
        "none";
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
  .getElementById(
    "login-submit-btn"
  )
  ?.addEventListener(
    "click",
    handleLogin
  );


document
  .getElementById(
    "signup-submit-btn"
  )
  ?.addEventListener(
    "click",
    handleSignup
  );


document
  .getElementById(
    "login-password"
  )
  ?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    }
  );


document
  .getElementById(
    "signup-password"
  )
  ?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        handleSignup();
      }
    }
  );


window.openAuthModal =
  openAuthModal;

window.closeAuthModal =
  closeAuthModal;
