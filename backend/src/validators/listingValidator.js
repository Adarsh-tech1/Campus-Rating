const { query, param } = require("express-validator");

const paginationRules = () => [
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000000 })
    .withMessage("Page must be an integer between 1 and 1000000")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100")
    .toInt(),
];

const sortRules = (fields) => [
  query("sortBy")
    .optional()
    .isIn(fields)
    .withMessage(`Sort field must be one of: ${fields.join(", ")}`),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

const storeListingValidator = [
  ...paginationRules(),
  query("search").optional().trim().isLength({ max: 100 }),
  query("address").optional().trim().isLength({ max: 400 }),
  ...sortRules(["id", "name", "email", "address", "rating"]),
];

const adminStoreListingValidator = storeListingValidator;

const adminUserListingValidator = [
  ...paginationRules(),
  query("search").optional().trim().isLength({ max: 100 }),
  query("name").optional().trim().isLength({ max: 60 }),
  query("email").optional().trim().isLength({ max: 254 }),
  query("address").optional().trim().isLength({ max: 400 }),
  query("role").optional().isIn(["ADMIN", "USER", "STORE_OWNER"]),
  ...sortRules(["id", "name", "email", "role", "created_at"]),
];

const idParamValidator = [
  param("id")
    .isInt({ min: 1, max: 2147483647 })
    .withMessage("ID must be a valid positive integer")
    .toInt(),
];

module.exports = {
  storeListingValidator,
  adminStoreListingValidator,
  adminUserListingValidator,
  idParamValidator,
};
