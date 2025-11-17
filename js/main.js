import { getFromStorage } from "./utils/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = getFromStorage("user");
  const creditsEl = document.getElementById("userCredits");

  if (user) {
    creditsEl.textContent = `Credits: ${user.credits || 0}`;
    document.querySelector(".btn-outline-light").textContent = "Logout";
    document.querySelector(".btn-outline-light").addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  }
});
