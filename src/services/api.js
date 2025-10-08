// File: src/services/api.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://rgpt-7.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// 🔹 Attach access token on every request
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle 401 (access token expired) → refresh token automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token found");

        const res = await axios.post(`${BASE_URL}/token/refresh/`, { refresh });
        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login"; // redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;
