import { apiRequest } from "../utils/api.js";
import { getFromStorage } from "../utils/storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  const profile = getFromStorage("profile");   // FIXED
  const token = getFromStorage("token");
  const container = document.getElementById("profileContainer");

  if (!profile || !token) {
    window.location.href = "login.html";
    return;
  }

  try {
    // Fetch full updated profile
    const res = await apiRequest(
      `/auction/profiles/${profile.name}?_listings=true&_wins=true`,
      "GET",
      null,
      true,       // authenticated
      token       // FIXED
    );

    const user = res.data;

    container.innerHTML = `
      <div class="text-center">
        <img src="${user.avatar?.url || './images/default.jpg'}" 
             alt="Avatar" 
             class="rounded-circle mb-3" 
             width="120">

        <h3>${user.name}</h3>
        <p>${user.bio || "No bio set"}</p>

        <p><strong>Credits:</strong> ${user.credits}</p>

        <hr>

        <h5>Your Listings (${user._count.listings})</h5>
        <ul class="list-group mb-4">
          ${user.listings
            .map(
              (listing) => `
              <li class="list-group-item d-flex justify-content-between">
                <span>${listing.title}</span>
                <a href="single-listing.html?id=${listing.id}" class="btn btn-sm btn-outline-primary">View</a>
              </li>`
            )
            .join("")}
        </ul>

        <h5>Auctions You Won (${user._count.wins})</h5>
        <ul class="list-group mb-4">
          ${user.wins
            .map(
              (win) => `
              <li class="list-group-item d-flex justify-content-between">
                <span>${win.title}</span>
                <a href="single-listing.html?id=${win.id}" class="btn btn-sm btn-outline-success">View</a>
              </li>`
            )
            .join("")}
        </ul>

        <button id="logoutBtn" class="btn btn-danger mt-3">Logout</button>
      </div>
    `;

    // Proper logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });

  } catch (error) {
    container.innerHTML = `<p class="text-danger">${error.message}</p>`;
  }
});
