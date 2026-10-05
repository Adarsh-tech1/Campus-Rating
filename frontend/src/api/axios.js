import axios from "axios";
import { clearSession, getToken } from "../utils/storage.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && getToken()) {
    clearSession();
    window.dispatchEvent(new Event("campus-rating:session-expired"));
  }
  return Promise.reject(error);
});

export default api;
