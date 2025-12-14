export function renderListingCard(listing) {
  const { id, title, media, endsAt, _count, bids } = listing;

  const imageUrl = media?.[0]?.url || "https://placehold.co/600x400?text=No+Image";
  const imageAlt = media?.[0]?.alt || title || "Listing image";

  const highestBid = bids?.length ? Math.max(...bids.map((b) => b.amount)) : null;

  const endDate = endsAt ? new Date(endsAt).toLocaleDateString() : "N/A";
  const bidCount = _count?.bids ?? (bids?.length ?? 0);

  return `
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${imageUrl}" class="card-img-top" alt="${imageAlt}">
        <div class="card-body">
          <h5 class="card-title">${title ?? "Untitled listing"}</h5>
          <p class="card-text"><strong>Bids:</strong> ${bidCount}</p>
          ${highestBid !== null
      ? `<p class="card-text"><strong>Highest Bid:</strong> ${highestBid} credits</p>`
      : ""
          }
          <p class="card-text"><small class="text-muted">Ends: ${endDate}</small></p>
          <a href="single-listing.html?id=${id}" class="btn btn-primary w-100">View Details</a>
        </div>
      </div>
    </div>`;
}
