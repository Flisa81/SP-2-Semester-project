import { apiRequest } from "../utils/api.js";
import { getFromStorage } from "../utils/storage.js";

const form = document.getElementById("editListingForm");
const msgBox = document.getElementById("messageBox");
const deleteBtn = document.getElementById("deleteBtn");

const titleEl = document.getElementById("title");
const descEl = document.getElementById("description");
const mediaUrlEl = document.getElementById("mediaUrl");
const tagsEl = document.getElementById("tags");
// const endsAtEl = document.getElementById("endsAt"); // not recommended for update

function showMessage(message, type = "danger") {
  if (!msgBox) return;
  msgBox.className = `alert mt-4 alert-${type}`;
  msgBox.textContent = message;
  msgBox.classList.remove("d-none");
}

function toDatetimeLocal(isoString) {
  // Converts ISO to yyyy-MM-ddTHH:mm (for input datetime-local)
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");

if (!listingId) {
  window.location.href = "listings.html";
}

const token = getFromStorage("token");
if (!token) {
  window.location.href = "login.html";
}

// 1) Load listing + prefill form
async function loadListing() {
  try {
    const res = await apiRequest(`/auction/listings/${listingId}`, "GET");
    const listing = res.data;

    titleEl.value = listing.title || "";
    descEl.value = listing.description || "";
    mediaUrlEl.value = listing.media?.[0]?.url || "";
    tagsEl.value = (listing.tags || []).join(", ");

    // If you keep endsAt input for display only:
    // if (endsAtEl) endsAtEl.value = toDatetimeLocal(listing.endsAt);
  } catch (err) {
    showMessage(err.message || "Failed to load listing.");
  }
}

// 2) Update listing
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgBox?.classList.add("d-none");

  const title = titleEl.value.trim();
  const description = descEl.value.trim();
  const mediaUrl = mediaUrlEl.value.trim();
  const tags = tagsEl.value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!title) {
    showMessage("Title is required.", "warning");
    return;
  }

  const payload = {
    title,
    description,
    tags,
    media: mediaUrl ? [{ url: mediaUrl, alt: title || "Listing image" }] : [],
  };

  try {
    await apiRequest(`/auction/listings/${listingId}`, "PUT", payload, true);
    showMessage("Listing updated successfully!", "success");
  } catch (err) {
    showMessage(err.message || "Failed to update listing.");
  }
});

// 3) Delete listing
deleteBtn?.addEventListener("click", async () => {
  const ok = confirm("Are you sure you want to delete this listing?");
  if (!ok) return;

  try {
    await apiRequest(`/auction/listings/${listingId}`, "DELETE", null, true);
    window.location.href = "profile.html";
  } catch (err) {
    showMessage(err.message || "Failed to delete listing.");
  }
});

loadListing();
