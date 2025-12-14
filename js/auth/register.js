console.log("REGISTER.JS IS RUNNING");

import { apiRequest } from "../utils/api.js";

const form = document.getElementById("registerForm");
console.log("REGISTER FORM FOUND:", form);

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("Registering:", { name, email });

    try {
      const result = await apiRequest("/auth/register", "POST", {
        name,
        email,
        password,
      });

      console.log("Registration Success:", result);

      alert("Registration successful! Redirecting to login page...");
      window.location.href = "/login";
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      const msg =
        error?.errors?.[0]?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      alert(msg);
    }
  });
}
