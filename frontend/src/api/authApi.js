import api from "./axios.js";

export const login = (payload) => api.post("/auth/login", payload);
export const register = (payload) => api.post("/auth/register", payload);
export const getProfile = () => api.get("/auth/profile");
export const changePassword = (payload) =>
  api.put("/auth/change-password", payload);
