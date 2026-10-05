import api from "./axios.js";
export const getAdminStats = () => api.get("/admin/stats");
export const getUsers = (params) => api.get("/admin/users", { params });
export const getUser = (id) => api.get(`/admin/users/${id}`);
export const createUser = (payload) => api.post("/admin/users", payload);
export const getAdminStores = (params) => api.get("/admin/stores", { params });
