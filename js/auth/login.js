console.log("LOGIN.JS IS RUNNING");

import { apiRequest } from "../utils/api.js";
import { saveToStorage } from "../utils/storage.js";

const form = document.getElementById("loginForm");
console.log("FORM FOUND?", form);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("FORM SUBMIT FIRED!");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    // LOGIN
    const loginRes = await apiRequest("/auth/login", "POST", { email, password });
    console.log("LOGIN RESPONSE:", loginRes);

    const token = loginRes.data.accessToken;
    const name = loginRes.data.name;

    // CREATE API KEY (requires Authorization)
    const apiKeyRes = await apiRequest(
      "/auth/create-api-key",
      "POST",
      {},
      true,
      token
    );
    console.log("API KEY RESPONSE:", apiKeyRes);

    const apiKey = apiKeyRes.data.key;

    // SAVE token and API KEY *before* making profile request
    saveToStorage("token", token);
    saveToStorage("apiKey", apiKey);

    // GET PROFILE (now API key IS stored, so request succeeds)
    const profileRes = await apiRequest(
      `/auction/profiles/${name}?_listings=true&_wins=true`,
      "GET",
      null,
      true,
      token
    );
    console.log("PROFILE RESPONSE:", profileRes);

    const profile = profileRes.data;

    saveToStorage("profile", profile);

    window.location.href = "profile.html";

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    alert(error.message);
  }
});
