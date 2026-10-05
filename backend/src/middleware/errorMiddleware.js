const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  const message =
    err.type === "entity.parse.failed"
      ? "Invalid JSON request body"
      : statusCode >= 500
        ? "Internal Server Error"
        : err.message || "Request failed";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;
