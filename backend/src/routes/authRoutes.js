const express = require("express");
const { rateLimit } = require("express-rate-limit");

const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} = require("../validators/authValidator");

const validationMiddleware = require("../validators/validationMiddleware");

const router = express.Router();
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      message: "Too many authentication attempts. Try again later.",
    }),
});

// Register
router.post(
  "/register",
  authRateLimit,
  registerValidator,
  validationMiddleware,
  registerUser,
);

// Login
router.post(
  "/login",
  authRateLimit,
  loginValidator,
  validationMiddleware,
  loginUser,
);

router.put(
  "/change-password",
  authMiddleware,
  authRateLimit,
  changePasswordValidator,
  validationMiddleware,
  changePassword,
);

// Profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

module.exports = router;
