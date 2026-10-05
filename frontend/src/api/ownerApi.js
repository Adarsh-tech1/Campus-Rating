import api from "./axios.js";
export const getOwnerStore = () => api.get("/owner/store");
export const getOwnerRatings = () => api.get("/owner/ratings");
