import { apiRequest } from "../utils/api.js";

const container = document.getElementById("listingsContainer");
const form = document.getElementById("filterForm");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortOrder = document.getElementById("sortOrder");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const resultCount = document.getElementById("resultCount");

let listings = [];
let currentPage = 1;
let totalPages = 1;
let currentQuery = "";
let currentStatus = "all";
let currentOrder = "desc";
let currentTag = "";
const limit = 9;

// 🧩 Fetch listings (supports search, filter, sort, tags, and pagination)
async function fetchListings({
  query = "",
  status = "all",
  order = "desc",
  tag = "",
  page = 1,
} = {}) {
  try {
    let url = `/auction/listings?limit=${limit}&page=${page}&sort=created&sortOrder=${order}`;

    // If searching
    if (query) {
      url = `/auction/listings/search?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}&sortOrder=${order}`;
    }

    // Filter by active or ended
    if (status === "active") url += "&_active=true";
    if (status === "ended") url += "&_active=false";

    // Filter by tag
    if (tag) url += `&_tag=${encodeURIComponent(tag)}`;

    const res = await apiRequest(url, "GET");
    const data = res.data || [];
    const meta = res.meta || {};

    if (page === 1) {
      listings = data;
    } else {
      listings = [...listings, ...data];
    }

    renderListings(listings);
    updatePagination(meta);
  } catch (error) {
    container.innerHTML = `<p class="text-danger">${error.message}</p>`;
  }
}

// 🖼️ Render listings with tag badges
function renderListings(list) {
  if (!list || list.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">No listings found.</p>`;
    loadMoreBtn.style.display = "none";
    resultCount.textContent = "";
    return;
  }

  container.innerHTML = list
    .map((listing) => {
      const img = listing.media?.[0]?.url || "./images/default.jpg";
      const endsAt = new Date(listing.endsAt);
      const isActive = endsAt > new Date();

      // 🔖 Render tags as clickable badges
      const tags =
        listing.tags && listing.tags.length
          ? listing.tags
              .map(
                (tag) =>
                  `<span class="badge bg-info text-dark me-1 mb-1 tag-badge" data-tag="${tag}">#${tag}</span>`
              )
              .join("")
          : `<span class="text-muted small">No tags</span>`;

      return `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <img src="${img}" class="card-img-top" alt="${listing.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${listing.title}</h5>
              <p class="card-text small text-muted">
                ${listing.description?.slice(0, 100) || "No description"}...
              </p>
              <div class="mb-2">${tags}</div>
              <p><strong>Ends:</strong> ${endsAt.toLocaleString()}</p>
              <span class="badge ${isActive ? "bg-success" : "bg-secondary"}">
                ${isActive ? "Active" : "Ended"}
              </span>
              <a href="single-listing.html?id=${listing.id}" class="btn btn-outline-primary mt-auto">View</a>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  attachTagClickHandlers();
}

// 🔗 Handle tag clicks dynamically
function attachTagClickHandlers() {
  const tagButtons = document.querySelectorAll(".tag-badge");
  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTag = btn.dataset.tag;
      currentQuery = "";
      searchInput.value = "";
      currentPage = 1;
      fetchListings({ tag: currentTag, order: currentOrder, page: currentPage });
      form.reset();
    });
  });
}

function updatePagination(meta) {
  totalPages = meta.pageCount || 1;
  currentPage = meta.currentPage || 1;
  const totalCount = meta.totalCount || listings.length;

  resultCount.textContent = `Showing ${listings.length} of ${totalCount} listings`;

  if (meta.isLastPage || currentPage >= totalPages) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-block";
  }
}

// 🔍 Search / Filter Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentQuery = searchInput.value.trim();
  currentStatus = statusFilter.value;
  currentOrder = sortOrder.value;
  currentTag = "";
  currentPage = 1;
  fetchListings({
    query: currentQuery,
    status: currentStatus,
    order: currentOrder,
    page: currentPage,
  });
});

// 📜 Load More
loadMoreBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchListings({
      query: currentQuery,
      status: currentStatus,
      order: currentOrder,
      tag: currentTag,
      page: currentPage,
    });
  }
});

// 🏁 Initial load
fetchListings();
