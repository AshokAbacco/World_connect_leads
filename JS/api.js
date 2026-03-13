// worldconnectleads — JS/api.js
// Vanilla fetch (no axios). Used by Dashboard.html, myProfile.html, Refer.html, login.html

// ─── Base URL ────────────────────────────────────────────────────────────────
// Switch comment to toggle local vs production
const API_URL = "https://international-business-solutions.onrender.com/api";

const SITE = "worldconnectleads";

// ─── Auth helpers (localStorage) ─────────────────────────────────────────────
export function getToken()  { return localStorage.getItem("wcl_token"); }
export function getUser()   { try { return JSON.parse(localStorage.getItem("wcl_user")); } catch { return null; } }
export function saveAuth(token, user) {
  localStorage.setItem("wcl_token", token);
  localStorage.setItem("wcl_user", JSON.stringify(user));
}
export function clearAuth() {
  localStorage.removeItem("wcl_token");
  localStorage.removeItem("wcl_user");
}
export function isLoggedIn() { return !!getToken(); }
export function isAdmin()    { const u = getUser(); return u?.role?.toLowerCase() === "admin"; }

// ─── Request helpers ─────────────────────────────────────────────────────────
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// Safe JSON fetch — always returns parsed JSON or throws with a readable message
async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  let json;
  try { json = await res.json(); } catch {
    throw new Error(`Server error (${res.status})`);
  }
  // Surface server-side error messages cleanly
  if (!res.ok && !json?.success) {
    throw new Error(json?.message || json?.error || `Request failed (${res.status})`);
  }
  return json;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function registerUser(data) {
  return apiFetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function loginUser(data) {
  return apiFetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getUsers() {
  return apiFetch(`${API_URL}/auth/users`, { headers: authHeaders() });
}

// ─── Samples — public ────────────────────────────────────────────────────────
// All public samples for this website (used on the public Samples page)
export async function getAllSamples() {
  return apiFetch(`${API_URL}/samples/get-all?website=${SITE}`);
}

// Row-data for a single sample — no auth required (public endpoint)
export async function getSampleDataPublic(sampleId) {
  return apiFetch(`${API_URL}/samples/${sampleId}/data/public`);
}

// ─── Samples — authenticated ─────────────────────────────────────────────────
// Logged-in user's own samples  (myProfile.html)
export async function getMySamples() {
  return apiFetch(`${API_URL}/samples`, { headers: authHeaders() });
}

// Row-data for a sample the user owns (authenticated)
export async function getSampleData(sampleId) {
  return apiFetch(`${API_URL}/samples/${sampleId}/data`, { headers: authHeaders() });
}

// Samples uploaded by a specific user (admin)
export async function getSamplesByUser(userId) {
  return apiFetch(`${API_URL}/samples/user/${userId}`, { headers: authHeaders() });
}

// All samples across all users, optionally filtered by website (admin)
export async function getAllSamplesAdmin(website = "") {
  const url = website
    ? `${API_URL}/samples/admin/all?website=${website}`
    : `${API_URL}/samples/admin/all`;
  return apiFetch(url, { headers: authHeaders() });
}

// Upload a sample file  (formData must include a `website` field)
export async function uploadSample(formData) {
  return apiFetch(`${API_URL}/samples/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` }, // no Content-Type — browser sets multipart boundary
    body: formData,
  });
}

// Upload a sample on behalf of another user (admin)
export async function uploadSampleForUser(formData) {
  return apiFetch(`${API_URL}/samples/upload-for-user`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
}

// Delete a sample
export async function deleteSample(sampleId) {
  return apiFetch(`${API_URL}/samples/${sampleId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

// ─── Downloads ────────────────────────────────────────────────────────────────
// Request a sample download (public — submits lead info)
export async function requestDownload(data) {
  return apiFetch(`${API_URL}/downloads/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// All download leads (admin only)
export async function getDownloadLeads() {
  return apiFetch(`${API_URL}/downloads/leads`, { headers: authHeaders() });
}

// ─── Referral ─────────────────────────────────────────────────────────────────
// My referral stats — coins, referralCode, referralLink, referredUsers  (Refer.html)
export async function getReferralStats() {
  return apiFetch(`${API_URL}/referral/my-stats`, { headers: authHeaders() });
}

// Submit / redeem a referral package
export async function submitReferral(data) {
  return apiFetch(`${API_URL}/referral`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export async function sendContactMessage(data) {
  return apiFetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}