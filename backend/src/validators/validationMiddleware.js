const { validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(({ location, path, param, msg }) => ({
        location,
        field: path || param,
        message: msg,
      })),
    });
  }

  next();
};

module.exports = validationMiddleware;
