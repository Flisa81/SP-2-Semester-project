import { apiRequest } from "../utils/api.js";

export async function deleteListing(id) {
  if (!confirm("Are you sure you want to delete this listing?")) return;

  try {
    await apiRequest(`/auction/listings/${id}`, "DELETE", null, true);
    alert("Listing deleted successfully.");
    window.location.href = "listings.html";
  } catch (error) {
    alert("Error deleting listing: " + error.message);
  }
}
