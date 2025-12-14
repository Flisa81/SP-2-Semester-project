import { getFromStorage } from "./utils/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = getFromStorage("profile");
  const creditsEl = document.getElementById("userCredits");
  const authButton = document.getElementById("authButton");

  if (!authButton) return;

  if (user) {
    if (creditsEl) {
      creditsEl.textContent = `Credits: ${user.credits ?? 0}`;
    }

    authButton.textContent = "Logout";
    authButton.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "/"; // Netlify-safe
    });
  }
});
