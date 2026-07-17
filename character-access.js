import {
  initializeApp,
  getApp,
  getApps
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCq3ag8O8i2Z7CZdcFCwsPnZu73e4ZdTPQ",
  authDomain: "method-in-motion.firebaseapp.com",
  projectId: "method-in-motion",
  storageBucket: "method-in-motion.firebasestorage.app",
  messagingSenderId: "1067937974009",
  appId: "1:1067937974009:web:5b21e6abe84e0b28234428"
};


const CHARACTER_ACCESS = {
  zen: ["explorer", "sparks", "coders"],
  bug: ["sparks", "coders"],
  echo: ["sparks", "coders"],
  byte: ["coders"],
  loop: ["coders"],
  nova: ["coders"]
};


const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


const characterName = window.location.pathname
  .split("/")
  .pop()
  .replace(".html", "")
  .toLowerCase();

const allowedTiers = CHARACTER_ACCESS[characterName];


function normalizeTier(value) {
  const tier = String(value || "explorer")
    .trim()
    .toLowerCase();

  return tier === "free"
    ? "explorer"
    : tier;
}


function redirectToMembership() {
  window.location.replace("membership.html");
}


function revealPage() {
  document.documentElement.style.visibility = "visible";
}


if (!allowedTiers) {
  revealPage();
} else {
  document.documentElement.style.visibility = "hidden";

  onAuthStateChanged(auth, async user => {
    if (!user) {
      redirectToMembership();
      return;
    }

    try {
      const userDocument = await getDoc(
        doc(db, "users", user.uid)
      );

      let tier = "explorer";

      if (userDocument.exists()) {
        const userData = userDocument.data();

        tier = normalizeTier(
          userData.tier ||
          userData.plan ||
          userData.selectedPlan
        );
      }

      if (!allowedTiers.includes(tier)) {
        redirectToMembership();
        return;
      }

      revealPage();

    } catch (error) {
      console.error(
        "Character access check failed:",
        error
      );

      redirectToMembership();
    }
  });
}
