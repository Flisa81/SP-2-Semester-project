import { apiRequest } from "../utils/api.js";
import { getFromStorage } from "../utils/storage.js";

const token = getFromStorage("token");
if (!token) {
  alert("You must be logged in to create a listing.");
  window.location.href = "login.html";
}

const form = document.getElementById("createListingForm");
const messageBox = document.getElementById("messageBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const mediaUrl = document.getElementById("mediaUrl").value.trim();
  const tagsInput = document.getElementById("tags").value.trim();
  const endsAt = document.getElementById("endsAt").value;

  // Convert tags from comma-separated string to array
  const tags = tagsInput
    ? tagsInput.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const media = mediaUrl ? [{ url: mediaUrl, alt: title }] : [];

  // Prepare listing payload
  const listingData = {
    title,
    description,
    tags,
    media,
    endsAt,
  };

  try {
    const res = await apiRequest("/auction/listings", "POST", listingData, true);
    showMessage("Listing created successfully!", "success");
    form.reset();

    // Redirect to listings page after success
    setTimeout(() => {
      window.location.href = "listings.html";
    }, 1500);
  } catch (error) {
    showMessage(error.message, "danger");
  }
});

function showMessage(msg, type) {
  messageBox.textContent = msg;
  messageBox.className = `alert alert-${type}`;
  messageBox.classList.remove("d-none");
}
