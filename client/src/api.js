// client/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-project-dependency-optimizer.onrender.com/api", // 🔥 directly use server URL
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Handle responses & errors neatly
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
