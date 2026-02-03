import axios from "axios";
import { getAccessToken, clearTokens } from "../utils/token";

const api = axios.create({
  baseURL: "http://localhost:8000/sms/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;

    if (error.response?.status === 401) {
      const isPublicPage =
        currentPath === "/login" || currentPath === "/register";

      if (!isPublicPage) {
        console.warn("Unauthorized! Clearing session and redirecting...");

        clearTokens();

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
