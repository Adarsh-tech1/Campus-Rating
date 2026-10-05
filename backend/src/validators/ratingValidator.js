const { body, param } = require("express-validator");

const addRatingValidator = [
  body("store_id")
    .notEmpty()
    .withMessage("Store ID is required")
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("Store ID must be a valid number")
    .toInt(),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5")
    .toInt(),
];

const updateRatingValidator = [
  param("id")
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("Rating ID must be a valid number")
    .toInt(),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5")
    .toInt(),
];

module.exports = {
  addRatingValidator,
  updateRatingValidator,
};
