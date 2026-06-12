import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Sign Up
export async function signUp(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), {
    displayName: displayName,
    email: email,
    tier: "free",
    createdAt: new Date().toISOString()
  });
  return user;
}

// Sign In
export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Sign Out
export async function logOut() {
  await signOut(auth);
}

// Get user data from Firestore
export async function getUserData(uid) {
  const docSnap = await getDoc(doc(db, "users", uid));
  if (docSnap.exists()) return docSnap.data();
  return null;
}

// Auth state listener — updates nav on every page
onAuthStateChanged(auth, async (user) => {
  const loginBtn   = document.querySelector('.nav-cta');
  const userMenu   = document.getElementById('nav-user-menu');
  const userNameEl = document.getElementById('nav-username');
  const dashLink   = document.getElementById('nav-dashboard-link');
  const logoutBtn  = document.getElementById('nav-logout-btn');

  if (user) {
    // Show user menu, hide login button
    if (loginBtn)   loginBtn.style.display  = 'none';
    if (userMenu)   userMenu.style.display  = 'flex';

    // Set display name
    let displayName = user.displayName || user.email.split('@')[0];
    try {
      const data = await getUserData(user.uid);
      if (data && data.displayName) displayName = data.displayName;

      // Unlock content based on tier
      const tier = data?.tier || 'free';
      const tierLessons = { free: 1, sparks: 2, builders: 3, coders: 4 };
      const unlockedCount = tierLessons[tier] || 1;

      document.querySelectorAll('.locked-section').forEach((el, i) => {
        const lessonNum = parseInt(el.dataset.lesson || '2');
        if (lessonNum <= unlockedCount) {
          el.classList.remove('locked-section');
          el.classList.add('unlocked-section');
        }
      });
    } catch(e) {
      console.log('getUserData error:', e);
    }

    if (userNameEl) userNameEl.textContent = displayName;

    // Wire logout button
    if (logoutBtn) {
      logoutBtn.onclick = async () => {
        await logOut();
        window.location.href = 'index.html';
      };
    }

    // Wire dashboard link
    if (dashLink) {
      dashLink.style.display = 'inline-flex';
    }

  } else {
    // Not logged in
    if (loginBtn)  loginBtn.style.display  = 'inline-flex';
    if (userMenu)  userMenu.style.display  = 'none';
    if (dashLink)  dashLink.style.display  = 'none';
  }
});
