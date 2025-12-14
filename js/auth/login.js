console.log("LOGIN.JS IS RUNNING");

import { apiRequest } from "../utils/api.js";
import { saveToStorage } from "../utils/storage.js";

const form = document.getElementById("loginForm");
console.log("FORM FOUND?", form);

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("FORM SUBMIT FIRED!");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      // 1) LOGIN
      const loginRes = await apiRequest("/auth/login", "POST", { email, password });
      console.log("LOGIN RESPONSE:", loginRes);

      const token = loginRes.data.accessToken;
      const name = loginRes.data.name;

      // 2) CREATE API KEY (requires Authorization)
      const apiKeyRes = await apiRequest("/auth/create-api-key", "POST", {}, true, token);
      console.log("API KEY RESPONSE:", apiKeyRes);

      const apiKey = apiKeyRes.data.key;

      // 3) SAVE token + apiKey
      saveToStorage("token", token);
      saveToStorage("apiKey", apiKey);

      // 4) GET PROFILE
      const profileRes = await apiRequest(
        `/auction/profiles/${name}?_listings=true&_wins=true`,
        "GET",
        null,
        true,
        token
      );
      console.log("PROFILE RESPONSE:", profileRes);

      saveToStorage("profile", profileRes.data);

      // 5) REDIRECT (Netlify-safe)
      window.location.href = "/profile";
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const msg =
        error?.errors?.[0]?.message ||
        error?.message ||
        "Login failed. Please try again.";

      alert(msg);
    }
  });
}
