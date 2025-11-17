import { API_AUCTION } from "../utils/constants.js";
import { load, save } from "../utils/storage.js";

const token = load("token");
const username = load("profile")?.name; // stored when user logs in

const form = document.querySelector("#editProfileForm");
const feedback = document.querySelector("#editProfileFeedback");

if (!token || !username) {
  window.location.href = "/login.html";
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedback.innerHTML = "";

    const avatarUrl = form.avatar.value.trim();

    if (!avatarUrl) {
      feedback.innerHTML = `<div class="alert alert-warning">Please enter an avatar URL.</div>`;
      return;
    }

    try {
      const res = await fetch(`${API_AUCTION}/profiles/${username}/media`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarUrl }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.errors?.[0]?.message || "Failed to update profile");

      // Update local storage with new avatar
      const profile = load("profile") || {};
      profile.avatar = avatarUrl;
      save("profile", profile);

      feedback.innerHTML = `<div class="alert alert-success">Profile updated successfully!</div>`;
      form.reset();
    } catch (err) {
      feedback.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  });
}
