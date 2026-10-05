const db = require("../config/db");

// ==================== GET OWNER STORE ====================

const getOwnerStore = (req, res) => {
  const owner_id = req.user.id;

  const sql = `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            COALESCE(AVG(r.rating), 0) AS average_rating
        FROM stores s
        LEFT JOIN ratings r
            ON s.id = r.store_id
        WHERE s.owner_id = ?
        GROUP BY s.id
    `;

  db.query(sql, [owner_id], (err, result) => {
    if (err) {
      console.error("Owner store query failed:", err.message);

      return res.status(500).json({
        success: false,
        message: "Could not get store",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No store found for this owner",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Store fetched successfully",
      data: {
        store: result[0],
      },
    });
  });
};

// ==================== GET OWNER RATINGS ====================

const getOwnerRatings = (req, res) => {
  const owner_id = req.user.id;

  const sql = `
        SELECT
            r.id,
            r.store_id,
            r.rating,
            r.created_at,
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email,
            s.name AS store_name
        FROM ratings r
        JOIN users u
            ON r.user_id = u.id
        JOIN stores s
            ON r.store_id = s.id
        WHERE s.owner_id = ?
        ORDER BY r.id DESC
    `;

  db.query(sql, [owner_id], (err, result) => {
    if (err) {
      console.error("Owner ratings query failed:", err.message);

      return res.status(500).json({
        success: false,
        message: "Could not get ratings",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ratings fetched successfully",
      data: {
        ratings: result,
      },
    });
  });
};

module.exports = {
  getOwnerStore,
  getOwnerRatings,
};
