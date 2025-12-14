// js/profile/getProfile.js
import { apiRequest } from "../utils/api.js";
import { getFromStorage, saveToStorage } from "../utils/storage.js";


document.addEventListener("DOMContentLoaded", async () => {
  const storedProfile = getFromStorage("profile");
  const token = getFromStorage("token");
  const container = document.getElementById("profileContainer");

  // If not logged in, send to login
  if (!storedProfile || !token) {
    window.location.href = "login.html";
    return;
  }

  try {
    // Get full profile with listings + wins
    const res = await apiRequest(
      `/auction/profiles/${storedProfile.name}?_listings=true&_wins=true`,
      "GET",
      null,
      true,
      token
    );

    const profile = res.data;
    // ✅ Get listings the user has bid on (required by brief)
    const listingsRes = await apiRequest("/auction/listings?_bids=true&limit=100", "GET");
    const allListings = listingsRes.data || [];

    const myBidListings = allListings.filter((listing) =>
      listing.bids?.some((bid) => bid.bidder?.name === profile.name)
    );

    // remove duplicates
    const uniqueBidListings = [...new Map(myBidListings.map((l) => [l.id, l])).values()];


    const initials = profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const listingsCount = profile._count?.listings ?? profile.listings?.length ?? 0;
    const winsCount = profile._count?.wins ?? profile.wins?.length ?? 0;

    // For now we don’t calculate real active bids – can be 0 or future feature
    const activeBids = 0;

    container.innerHTML = `
      <div class="row g-4">
        <!-- LEFT: PROFILE CARD -->
        <div class="col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                   style="width:96px;height:96px;font-size:32px;">
                ${initials}
              </div>
              <h4 class="mb-1">${profile.name}</h4>
              <p class="text-muted mb-3">${profile.email}</p>
              <p class="mb-1"><strong>${profile.credits}</strong> credits</p>
              <button class="btn btn-outline-secondary w-100 mt-3" id="editProfileBtn">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT: STATS + TABS -->
        <div class="col-lg-8">
          <!-- STATS CARDS -->
          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="card text-center shadow-sm h-100">
                <div class="card-body">
                  <p class="text-muted mb-1">My Listings</p>
                  <h3 class="mb-0">${listingsCount}</h3>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card text-center shadow-sm h-100">
                <div class="card-body">
                  <p class="text-muted mb-1">Active Bids</p>
                  <h3 class="mb-0">${activeBids}</h3>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card text-center shadow-sm h-100">
                <div class="card-body">
                  <p class="text-muted mb-1">Items Won</p>
                  <h3 class="mb-0">${winsCount}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- LISTS TABS -->
          <div class="card shadow-sm">
            <div class="card-header border-0 pb-0">
              <ul class="nav nav-tabs card-header-tabs" id="profileTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="myListings-tab"
                          data-bs-toggle="tab" data-bs-target="#myListings"
                          type="button" role="tab">
                    My Listings
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="myBids-tab"
                          data-bs-toggle="tab" data-bs-target="#myBids"
                          type="button" role="tab">
                    My Bids
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="wonItems-tab"
                          data-bs-toggle="tab" data-bs-target="#wonItems"
                          type="button" role="tab">
                    Won Items
                  </button>
                </li>
              </ul>
            </div>

            <div class="card-body">
              <div class="tab-content">
                <!-- My Listings -->
                <div class="tab-pane fade show active" id="myListings" role="tabpanel">
                  ${renderListingList(profile.listings, true)}
                </div>

                <!-- My Bids -->
               <div class="tab-pane fade" id="myBids" role="tabpanel">
              ${renderListingList(uniqueBidListings, false)}
               </div>


                <!-- Won Items -->
                <div class="tab-pane fade" id="wonItems" role="tabpanel">
                  ${renderListingList(profile.wins, false)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="alert alert-danger">
        Could not load profile. ${error.message || ""}
      </div>`;
  }
});

/**
 * Helpers
 */
function renderListingList(listings = [], canEdit) {
  if (!listings.length) {
    return `<p class="text-muted mb-0">No items yet.</p>`;
  }

  return `
    <div class="list-group list-group-flush">
      ${listings
      .map((listing) => {
        const image =
          listing.media?.[0]?.url ||
          "https://placehold.co/80x80?text=No+Image";
        const tags =
          listing.tags?.length
            ? listing.tags
              .filter(Boolean)
              .map(
                (t) =>
                  `<span class="badge rounded-pill text-bg-light border me-1">${t}</span>`
              )
              .join("")
            : "";

        return `
            <div class="list-group-item d-flex align-items-center">
              <img src="${image}" alt="${listing.title}"
                   class="rounded me-3"
                   style="width:72px;height:72px;object-fit:cover;">
              <div class="flex-grow-1">
                <h6 class="mb-1">${listing.title}</h6>
                <div>${tags}</div>
              </div>
              <div class="d-flex gap-2">
                <a href="single-listing.html?id=${listing.id}"
                   class="btn btn-primary btn-sm">View</a>
                ${canEdit
            ? `<a href="edit-listing.html?id=${listing.id}"
                          class="btn btn-outline-secondary btn-sm">Edit</a>`
            : ""
          }
              </div>
            </div>
          `;
      })
      .join("")}
    </div>
  `;
}
