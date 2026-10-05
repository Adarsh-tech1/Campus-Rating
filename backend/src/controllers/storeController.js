const db = require("../config/db");

const createStore = async (req, res) => {
  const { name, email, address, owner_id: requestedOwnerId } = req.body;
  let ownerId = req.user.id;

  try {
    if (req.user.role === "ADMIN" && requestedOwnerId !== undefined) {
      const [owners] = await db
        .promise()
        .query("SELECT id FROM users WHERE id = ? AND role = ?", [
          requestedOwnerId,
          "STORE_OWNER",
        ]);

      if (owners.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Owner must be an existing STORE_OWNER",
        });
      }

      ownerId = owners[0].id;
    }

    const [result] = await db.promise().query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES (?, ?, ?, ?)`,
      [name, email, address, ownerId],
    );

    return res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: {
        storeId: result.insertId,
      },
    });
  } catch (error) {
    console.error("Store creation failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Store could not be created",
    });
  }
};

const getAllStores = async (req, res) => {
  const { search, address, sortBy = "id", sortOrder = "desc" } = req.query;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);
  const offset = (page - 1) * limit;
  const allowedSortFields = {
    id: "s.id",
    name: "s.name",
    email: "s.email",
    address: "s.address",
    rating: "average_rating",
  };

  if (!Object.hasOwn(allowedSortFields, sortBy)) {
    return res.status(400).json({
      message: "Invalid sort field",
    });
  }

  const sortColumn = allowedSortFields[sortBy];

  const direction = sortOrder === "asc" ? "ASC" : "DESC";

  const conditions = [];
  const values = [];

  if (search) {
    conditions.push("(s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)");
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (address) {
    conditions.push("s.address LIKE ?");
    values.push(`%${address}%`);
  }
  if (req.user.role === "STORE_OWNER") {
    conditions.push("s.owner_id = ?");
    values.push(req.user.id);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  try {
    const [countResult] = await db
      .promise()
      .query(`SELECT COUNT(*) AS total FROM stores s ${whereClause}`, values);
    const totalStores = countResult[0].total;
    const [stores] = await db.promise().query(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.address,
         s.owner_id,
         COALESCE(AVG(r.rating), 0) AS average_rating,
         COUNT(r.id) AS rating_count,
         (
           SELECT mine.rating
           FROM ratings mine
           WHERE mine.store_id = s.id AND mine.user_id = ?
           ORDER BY mine.id DESC
           LIMIT 1
         ) AS user_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${whereClause}
       GROUP BY s.id
       ORDER BY ${sortColumn} ${direction}, s.id DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, ...values, limit, offset],
    );

    return res.status(200).json({
      success: true,
      message: "Stores fetched successfully",
      data: {
        stores,
        pagination: {
          page,
          limit,
          totalStores,
          totalPages: Math.ceil(totalStores / limit),
        },
      },
    });
  } catch (error) {
    console.error("Store listing failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not get stores",
    });
  }
};

const getSingleStore = async (req, res) => {
  const ownerCondition =
    req.user.role === "STORE_OWNER" ? "AND s.owner_id = ?" : "";
  const queryValues = [req.user.id, req.params.id];

  if (req.user.role === "STORE_OWNER") {
    queryValues.push(req.user.id);
  }

  try {
    const [stores] = await db.promise().query(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.address,
         s.owner_id,
         COALESCE(AVG(r.rating), 0) AS average_rating,
         COUNT(r.id) AS rating_count,
         (
           SELECT mine.rating
           FROM ratings mine
           WHERE mine.store_id = s.id AND mine.user_id = ?
           ORDER BY mine.id DESC
           LIMIT 1
         ) AS user_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.id = ?
       ${ownerCondition}
       GROUP BY s.id`,
      queryValues,
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Store fetched successfully",
      data: {
        store: stores[0],
      },
    });
  } catch (error) {
    console.error("Store details query failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not get store",
    });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getSingleStore,
};
