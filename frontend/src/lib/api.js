// Base URL of the backend API.
// In production this is set via .env.production (VITE_API_BASE_URL).
// In development it is empty so that Vite's proxy forwards /api & /uploads.
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/** Build a full API URL from a relative path, e.g. "/api/products" */
export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

/**
 * Ensure image/upload URLs point to the correct host.
 * Paths stored in the DB as "/uploads/..." must be rewritten
 * to the backend origin in production.
 */
export function imageUrl(path) {
  if (!path) return path;
  if (path.startsWith("/uploads/")) {
    return `${API_BASE}${path}`;
  }
  return path;
}
