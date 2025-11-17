const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");

if (!listingId) {
  alert("No listing selected to edit.");
  window.location.href = "listings.html";
}

import { apiRequest } from "../utils/api.js";
import { getFromStorage } from "../utils/storage.js";

const form = document.getElementById("editListingForm");
const messageBox = document.getElementById("messageBox");
const deleteBtn = document.getElementById("deleteBtn");

const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");

// Auth check
const token = getFromStorage("token");
if (!token) {
  alert("You must be logged in to edit listings.");
  window.location.href = "login.html";
}

// Fetch listing details
async function fetchListing() {
  try {
    const res = await apiRequest(`/auction/listings/${listingId}`, "GET");
    const listing = res.data;

    document.getElementById("title").value = listing.title || "";
    document.getElementById("description").value = listing.description || "";
    document.getElementById("mediaUrl").value = listing.media?.[0]?.url || "";
    document.getElementById("tags").value = listing.tags?.join(", ") || "";
    document.getElementById("endsAt").value = listing.endsAt
      ? new Date(listing.endsAt).toISOString().slice(0, 16)
      : "";
  } catch (error) {
    showMessage("Error loading listing: " + error.message, "danger");
  }
}

fetchListing();

// Update listing
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const mediaUrl = document.getElementById("mediaUrl").value.trim();
  const tagsInput = document.getElementById("tags").value.trim();
  const endsAt = document.getElementById("endsAt").value;

  const tags = tagsInput
    ? tagsInput.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];
  const media = mediaUrl ? [{ url: mediaUrl, alt: title }] : [];

  const updateData = { title, description, tags, media, endsAt };

  try {
    await apiRequest(`/auction/listings/${listingId}`, "PUT", updateData, true);
    showMessage("Listing updated successfully!", "success");
    setTimeout(() => (window.location.href = "single-listing.html?id=" + listingId), 1500);
  } catch (error) {
    showMessage("Error updating listing: " + error.message, "danger");
  }
});

// Delete listing
deleteBtn.addEventListener("click", async () => {
  const confirmDelete = confirm("Are you sure you want to delete this listing?");
  if (!confirmDelete) return;

  try {
    await apiRequest(`/auction/listings/${listingId}`, "DELETE", null, true);
    showMessage("Listing deleted successfully!", "success");
    setTimeout(() => (window.location.href = "listings.html"), 1000);
  } catch (error) {
    showMessage("Error deleting listing: " + error.message, "danger");
  }
});

function showMessage(msg, type) {
  messageBox.textContent = msg;
  messageBox.className = `alert alert-${type}`;
  messageBox.classList.remove("d-none");
}
