const express = require("express");

const {
  createStore,
  getAllStores,
  getSingleStore,
} = require("../controllers/storeController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validationMiddleware = require("../validators/validationMiddleware");

const storeValidator = require("../validators/storeValidator");
const {
  storeListingValidator,
  idParamValidator,
} = require("../validators/listingValidator");

const router = express.Router();

// Admin OR Store Owner can create store
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "STORE_OWNER"),
  storeValidator,
  validationMiddleware,
  createStore,
);

// Any logged-in user can see stores
router.get(
  "/",
  authMiddleware,
  storeListingValidator,
  validationMiddleware,
  getAllStores,
);

// Any logged-in user can see one store
router.get(
  "/:id",
  authMiddleware,
  idParamValidator,
  validationMiddleware,
  getSingleStore,
);

module.exports = router;
