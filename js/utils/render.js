// Render alert messages
export function renderAlert(message, type = "info") {
  return `<div class="alert alert-${type}" role="alert">${message}</div>`;
}

// Render loading spinner
export function renderLoader() {
  return `
    <div class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`;
}

// Render listing cards (for index.html)
export function renderListingCard(listing) {
  const { id, title, media, bids, endsAt } = listing;

  const imageUrl = media?.[0]?.url || "https://placehold.co/600x400?text=No+Image";
  const highestBid = bids?.length ? Math.max(...bids.map(b => b.amount)) : 0;
  const endDate = new Date(endsAt).toLocaleDateString();

  return `
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${imageUrl}" class="card-img-top" alt="${title}">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text"><strong>Highest Bid:</strong> ${highestBid} credits</p>
          <p class="card-text"><small class="text-muted">Ends: ${endDate}</small></p>
          <a href="listing.html?id=${id}" class="btn btn-primary w-100">View Details</a>
        </div>
      </div>
    </div>`;
}

// Render profile information
export function renderProfile(profile) {
  const avatar = profile.avatar?.url || "https://placehold.co/150x150?text=Avatar";
  return `
    <div class="text-center mb-4">
      <img src="${avatar}" alt="Avatar" class="rounded-circle mb-3" width="150" height="150">
      <h3>${profile.name}</h3>
      <p><strong>Credits:</strong> ${profile.credits}</p>
    </div>`;
}
