const API_BASE = "https://v2.api.noroff.dev";

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  auth = false,
  tokenOverride = null
) {
  const storedToken = localStorage.getItem("token");
  const storedApiKey = localStorage.getItem("apiKey");

  const headers = {
    "Content-Type": "application/json",
  };

  // --- ALWAYS USE tokenOverride for Authorization when provided ---
  if (tokenOverride) {
    headers["Authorization"] = `Bearer ${tokenOverride}`;
  }
  else if (auth && storedToken) {
    headers["Authorization"] = `Bearer ${storedToken}`;
  }

  // --- API key only when auth = true AND apiKey exists ---
  if (auth && storedApiKey) {
    headers["X-Noroff-API-Key"] = storedApiKey;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(API_BASE + endpoint, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || "API Error");
  }

  return result;
}
