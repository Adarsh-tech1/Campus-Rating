const express = require("express");

const {
  getStats,
  createUser,
  getAllUsers,
  getUserById,
  getAllAdminStores,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validationMiddleware = require("../validators/validationMiddleware");
const { adminCreateUserValidator } = require("../validators/authValidator");
const {
  adminUserListingValidator,
  adminStoreListingValidator,
  idParamValidator,
} = require("../validators/listingValidator");

const router = express.Router();

router.get("/stats", authMiddleware, roleMiddleware("ADMIN"), getStats);

router.post(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminCreateUserValidator,
  validationMiddleware,
  createUser,
);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminUserListingValidator,
  validationMiddleware,
  getAllUsers,
);

router.get(
  "/users/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  idParamValidator,
  validationMiddleware,
  getUserById,
);

router.get(
  "/stores",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminStoreListingValidator,
  validationMiddleware,
  getAllAdminStores,
);

module.exports = router;
