const db = require("../config/db");

const addRating = async (req, res) => {
  const { store_id: storeId, rating } = req.body;
  const userId = req.user.id;

  try {
    const [stores] = await db
      .promise()
      .query("SELECT id FROM stores WHERE id = ?", [storeId]);

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const [existingRatings] = await db.promise().query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId],
    );

    if (existingRatings.length > 0) {
      return res.status(409).json({
        success: false,
        message: "You have already rated this store",
      });
    }

    const [result] = await db.promise().query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, storeId, rating],
    );

    return res.status(201).json({
      success: true,
      message: "Rating added successfully",
      data: {
        ratingId: result.insertId,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "You have already rated this store",
      });
    }

    console.error("Rating creation failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Rating could not be added",
    });
  }
};

const updateRating = async (req, res) => {
  try {
    const [result] = await db.promise().query(
      "UPDATE ratings SET rating = ? WHERE id = ? AND user_id = ?",
      [req.body.rating, req.params.id, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rating updated successfully",
    });
  } catch (error) {
    console.error("Rating update failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Rating could not be updated",
    });
  }
};

module.exports = {
  addRating,
  updateRating,
};
