import { apiRequest } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("listingsContainer");

  try {
    const response = await apiRequest("/auction/listings?_active=true&_bids=true&_seller=true");
    const listings = response.data;

    container.innerHTML = listings.map(listing => `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
         <img src="${listing.media?.[0]?.url || 'https://placehold.co/600x400?text=No+Image'}" class="card-img-top" alt="${listing.media?.[0]?.alt || listing.title || 'Listing image'}">
          <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p>${listing.description || "No description available"}</p>
            <a href="single-listing.html?id=${listing.id}" class="btn btn-primary btn-sm">View Listing</a>
          </div>
        </div>
      </div>
    `).join("");
  } catch (error) {
    container.innerHTML = `<p class="text-danger">${error.message}</p>`;
  }
});
