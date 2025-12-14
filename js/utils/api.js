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

  const headers = {};

  // Only set Content-Type when sending JSON body
  if (body !== null) {
    headers["Content-Type"] = "application/json";
  }

  // Authorization header
  const tokenToUse = tokenOverride || (auth ? storedToken : null);
  if (tokenToUse) {
    headers["Authorization"] = `Bearer ${tokenToUse}`;
  }

  // API key header 
  if (auth && storedApiKey) {
    headers["X-Noroff-API-Key"] = storedApiKey;
  }

  const options = { method, headers };
  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);

  // Some responses might have no body
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    // Throw the *actual* API error object so caller can inspect errors[0].message
    const err = result || { message: `API Error (${response.status})` };
    err.status = response.status;
    throw err;
  }

  return result;
}
