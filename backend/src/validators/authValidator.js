const { body } = require("express-validator");

const identityValidators = () => [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("address")
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),
];

const passwordValidator = (field) =>
  body(field)
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character");

// Public registration must never grant administrator access. The first admin
// account is bootstrapped with the create-admin script; later admins are added
// through the protected admin endpoint.
const REGISTER_ROLES = ["USER", "STORE_OWNER"];

const registerValidator = [
  ...identityValidators(),
  passwordValidator("password"),
  body("role")
    .optional()
    .isIn(REGISTER_ROLES)
    .withMessage(`Role must be one of: ${REGISTER_ROLES.join(", ")}`),
];

const adminCreateUserValidator = [
  ...identityValidators(),
  passwordValidator("password"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["USER", "ADMIN", "STORE_OWNER"])
    .withMessage("Role must be USER, ADMIN or STORE_OWNER"),
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  passwordValidator("newPassword"),
];

module.exports = {
  registerValidator,
  adminCreateUserValidator,
  loginValidator,
  changePasswordValidator,
};
