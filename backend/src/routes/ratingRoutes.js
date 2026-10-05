const express = require("express");

const { addRating, updateRating } = require("../controllers/ratingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validationMiddleware = require("../validators/validationMiddleware");

const {
  addRatingValidator,
  updateRatingValidator,
} = require("../validators/ratingValidator");

const router = express.Router();

// Add rating
router.post(
  "/",
  authMiddleware,
  roleMiddleware("USER"),
  addRatingValidator,
  validationMiddleware,
  addRating,
);

// Update rating
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("USER"),
  updateRatingValidator,
  validationMiddleware,
  updateRating,
);

module.exports = router;
