import { getFromStorage } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.getElementById("authButton");
  const creditsDisplay = document.getElementById("userCredits");

  const profile = getFromStorage("profile");

  if (!authButton) return; // Not all pages have navbar

  if (profile) {
    authButton.textContent = "Profile";
    authButton.href = "profile.html";

    if (creditsDisplay) {
      creditsDisplay.textContent = `Credits: ${profile.credits}`;
    }
  } else {
    authButton.textContent = "Login";
    authButton.href = "login.html";

    if (creditsDisplay) creditsDisplay.textContent = "";
  }
});
