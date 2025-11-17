import { apiRequest } from "../utils/api.js";

export async function updateListing(id, data) {
  try {
    const response = await apiRequest(`/auction/listings/${id}`, "PUT", data, true);
    return response;
  } catch (error) {
    alert("Error updating listing: " + error.message);
  }
}
