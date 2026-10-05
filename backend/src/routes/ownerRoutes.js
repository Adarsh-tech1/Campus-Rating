const express = require("express");

const {
  getOwnerStore,
  getOwnerRatings,
} = require("../controllers/ownerController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/store",
  authMiddleware,
  roleMiddleware("STORE_OWNER"),
  getOwnerStore,
);

router.get(
  "/ratings",
  authMiddleware,
  roleMiddleware("STORE_OWNER"),
  getOwnerRatings,
);

module.exports = router;
