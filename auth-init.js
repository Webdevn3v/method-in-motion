// Method in Motion — Auth Modal Init
// Add this as a <script type="module"> at the bottom of each page

import { initAuth, openAuthModal, closeAuthModal, signIn, signUp, logOut } from "./auth.js";

// Boot auth state listener
initAuth();

// Close button
document.getElementById("auth-close-btn")?.addEventListener("click", closeAuthModal);

// Close on overlay click
document.getElementById("auth-modal")?.addEventListener("click", (e) => {
  if (e.target.id === "auth-modal") closeAuthModal();
});

// Tab switching
document.querySelectorAll(".auth-tab, .auth-link").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    if (!tab) return;
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
    document.querySelector(`.auth-tab[data-tab="${tab}"]`)?.classList.add("active");
    document.getElementById(`${tab}-form`)?.classList.add("active");
    document.querySelectorAll(".auth-error").forEach(el => el.textContent = "");
  });
});

// Login submit
document.getElementById("login-submit-btn")?.addEventListener("click", () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  if (!email || !password) {
    document.getElementById("login-error").textContent = "Please fill in all fields.";
    return;
  }
  signIn(email, password);
});

// Signup submit
document.getElementById("signup-submit-btn")?.addEventListener("click", () => {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  if (!name || !email || !password) {
    document.getElementById("signup-error").textContent = "Please fill in all fields.";
    return;
  }
  signUp(email, password, name);
});

// Logout button (nav)
document.getElementById("nav-logout-btn")?.addEventListener("click", logOut);

// Any "Join the Crew" / "Log In" buttons on the page
document.querySelectorAll("[data-auth='login']").forEach(btn => {
  btn.addEventListener("click", () => openAuthModal("login"));
});

document.querySelectorAll("[data-auth='signup']").forEach(btn => {
  btn.addEventListener("click", () => openAuthModal("signup"));
});

// Keyboard close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAuthModal();
});
