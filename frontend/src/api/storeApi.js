import api from "./axios.js";
export const getStores = (params) => api.get("/stores", { params });
export const getStore = (id) => api.get(`/stores/${id}`);

// Store creation is allowed for STORE_OWNER and ADMIN.
export const createStore = (payload) => api.post("/stores", payload);
