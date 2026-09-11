// api/products.js — All fetch calls to the API live here.
// The base URL is read from .env (VITE_API_URL) so it's defined in one place.
// If we ever change the server URL, we only update .env — not every fetch call.

const BASE_URL = import.meta.env.VITE_API_URL;

// Helper: parse the response and throw a proper Error if the server returned
// an error status (4xx / 5xx). Without this, fetch() only rejects on network
// errors — a 404 or 500 would appear to "succeed" from fetch's point of view.
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    // Use the server's error message if it sent one, otherwise fall back
    const message =
      data?.messages?.join(", ") || data?.error || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// GET /products?name=...&sort=...
export function getProducts({ name = "", sort = "" } = {}) {
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (sort) params.set("sort", sort);

  const query = params.toString() ? `?${params.toString()}` : "";
  return fetch(`${BASE_URL}/products${query}`).then(handleResponse);
}

// GET /products/:id
export function getProduct(id) {
  return fetch(`${BASE_URL}/products/${id}`).then(handleResponse);
}

// POST /products
export function createProduct(data) {
  return fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

// PUT /products/:id
export function updateProduct(id, data) {
  return fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

// DELETE /products/:id
export function deleteProduct(id) {
  return fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  }).then(handleResponse);
}
