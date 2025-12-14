import { apiRequest } from "../utils/api.js";
import { getFromStorage, saveToStorage } from "../utils/storage.js";

export function setupEditProfileForm() {
  const token = getFromStorage("token");
  const profile = getFromStorage("profile");
  const username = profile?.name;

  if (!token || !username) {
    window.location.href = "login.html";
    return;
  }

  const form = document.querySelector("#editProfileForm");
  const feedback = document.querySelector("#editProfileFeedback");
  if (!form) return;

  // Prefill form from stored profile (nice UX)
  form.bio.value = profile?.bio || "";
  form.avatarUrl.value = profile?.avatar?.url || "";
  form.avatarAlt.value = profile?.avatar?.alt || "";
  form.bannerUrl.value = profile?.banner?.url || "";
  form.bannerAlt.value = profile?.banner?.alt || "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (feedback) feedback.innerHTML = "";

    const bio = form.bio.value.trim();

    const avatarUrl = form.avatarUrl.value.trim();
    const avatarAlt = form.avatarAlt.value.trim();

    const bannerUrl = form.bannerUrl.value.trim();
    const bannerAlt = form.bannerAlt.value.trim();

    // Build payload (only include avatar/banner if url is provided)
    const payload = {
      bio,
      ...(avatarUrl ? { avatar: { url: avatarUrl, alt: avatarAlt || "" } } : {}),
      ...(bannerUrl ? { banner: { url: bannerUrl, alt: bannerAlt || "" } } : {}),
    };

    try {
      // ✅ v2 Auction profile update endpoint pattern
      const res = await apiRequest(`/auction/profiles/${username}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      // res.data should be the updated profile
      saveToStorage("profile", res.data);

      if (feedback) {
        feedback.innerHTML = `<div class="alert alert-success">Profile updated successfully!</div>`;
      }
    } catch (err) {
      if (feedback) {
        feedback.innerHTML = `<div class="alert alert-danger">${err.message || "Failed to update profile"}</div>`;
      }
    }
  });
}
