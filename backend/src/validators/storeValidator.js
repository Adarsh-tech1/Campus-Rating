const { body } = require("express-validator");

const storeValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Store name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Store name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Store email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Store address is required")
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),

  body("owner_id")
    .optional()
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("Owner ID must be a positive integer")
    .toInt(),
];

module.exports = storeValidator;
