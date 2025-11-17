import { apiRequest } from "../utils/api.js";
import { getFromStorage } from "../utils/storage.js";

const listingContainer = document.getElementById("listingDetails");
const bidList = document.getElementById("bidList");
const bidSection = document.getElementById("bidSection");
const bidForm = document.getElementById("bidForm");
const bidMessage = document.getElementById("bidMessage");

const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");

const currentUser = getFromStorage("profile");
const token = getFromStorage("token");

// Fetch listing by ID
async function fetchListing() {
  try {
    const response = await apiRequest(
      `/auction/listings/${listingId}?_bids=true&_seller=true`,
      "GET"
    );

    const listing = response.data;
    renderListing(listing);
    renderBids(listing.bids || []);
  } catch (error) {
    listingContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

// Display listing details
function renderListing(listing) {
  const image =
    listing.media?.[0]?.url ||
    "https://via.placeholder.com/800x400?text=No+Image+Available";

  listingContainer.innerHTML = `
    <img src="${image}" class="img-fluid rounded mb-3" alt="${listing.title}">
    <h2>${listing.title}</h2>
    <p class="text-muted">${listing.description || "No description provided."}</p>
    <p><strong>Seller:</strong> ${listing.seller?.name}</p>
    <p><strong>Ends at:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
  `;

  // Show edit button or bid form
  if (currentUser && currentUser.name === listing.seller?.name) {
    document.getElementById("actionsContainer").innerHTML = `
      <a href="edit-listing.html?id=${listing.id}" class="btn btn-warning">Edit Listing</a>
    `;
  } else if (currentUser) {
    bidSection.classList.remove("d-none");
  }
}

// Render bids
function renderBids(bids) {
  if (!bids.length) {
    bidList.innerHTML = `<li class="list-group-item">No bids yet</li>`;
    return;
  }

  const sorted = bids.sort((a, b) => b.amount - a.amount);

  bidList.innerHTML = sorted
    .map(
      (b, i) => `
      <li class="list-group-item d-flex justify-content-between">
        <span>${b.bidder.name}</span>
        <span class="${i === 0 ? "fw-bold text-success" : ""}">
          ${b.amount} credits
        </span>
      </li>`
    )
    .join("");
}

// Handle bid submission
bidForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("bidAmount").value);

  if (!amount || amount <= 0)
    return showMessage("Please enter a valid bid amount", "danger");

  try {
    await apiRequest(`/auction/listings/${listingId}/bids`, "POST", { amount }, true);
    showMessage("Bid placed successfully!", "success");
    bidForm.reset();
    fetchListing();
  } catch (error) {
    showMessage(error.message, "danger");
  }
});

function showMessage(msg, type) {
  bidMessage.textContent = msg;
  bidMessage.className = `alert alert-${type}`;
  bidMessage.classList.remove("d-none");
}

fetchListing();
