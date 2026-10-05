import api from "./axios.js";

// The API returns `user_rating` but never the rating's own id, which
// PUT /ratings/:id needs, so there is no update call to make yet.
export const addRating = (payload) => api.post("/ratings", payload);
