// client/src/api.js
import axios from "axios";

// Resolve API base URL from envs (works for Vite or CRA) with a safe fallback.
const API_BASE = (() => {
  // Vite: use VITE_API_URL (should include /api)
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Create React App: use REACT_APP_API_URL (should include /api)
  if (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Fallback to your deployed backend
  return "https://ai-project-dependency-optimizer.onrender.com/api";
})();

const api = axios.create({
  baseURL: API_BASE,            // e.g., https://...onrender.com/api
  timeout: 15000,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

// Optional: unwrap data and surface meaningful errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err.message ||
      "Request failed";
    return Promise.reject(new Error(msg));
  }
);

export default api;
