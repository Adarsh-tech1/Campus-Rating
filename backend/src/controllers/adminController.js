const bcrypt = require("bcryptjs");
const db = require("../config/db");

const getStats = async (req, res) => {
  try {
    const [result] = await db.promise().query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM stores) AS total_stores,
        (SELECT COUNT(*) FROM ratings) AS total_ratings
    `);

    return res.status(200).json({
      success: true,
      message: "Statistics fetched successfully",
      data: {
        stats: result[0],
      },
    });
  } catch (error) {
    console.error("Admin statistics query failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not get statistics",
    });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    const [existingUsers] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.promise().query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, address ?? null, role],
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        userId: result.insertId,
        role,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    console.error("Admin user creation failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not create user",
    });
  }
};

const getAllUsers = async (req, res) => {
  const {
    search,
    name,
    email,
    address,
    role,
    sortBy = "id",
    sortOrder = "desc",
  } = req.query;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);
  const offset = (page - 1) * limit;
  const allowedSortFields = {
    id: "id",
    name: "name",
    email: "email",
    role: "role",
    created_at: "created_at",
  };
  const sortColumn = Object.hasOwn(allowedSortFields, sortBy)
    ? allowedSortFields[sortBy]
    : "id";
  const direction = sortOrder === "asc" ? "ASC" : "DESC";
  const conditions = [];
  const values = [];

  if (search) {
    conditions.push("(name LIKE ? OR email LIKE ?)");
    values.push(`%${search}%`, `%${search}%`);
  }
  if (name) {
    conditions.push("name LIKE ?");
    values.push(`%${name}%`);
  }
  if (email) {
    conditions.push("email LIKE ?");
    values.push(`%${email}%`);
  }
  if (address) {
    conditions.push("address LIKE ?");
    values.push(`%${address}%`);
  }
  if (role) {
    conditions.push("role = ?");
    values.push(role);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  try {
    const [countResult] = await db
      .promise()
      .query(`SELECT COUNT(*) AS total FROM users ${whereClause}`, values);
    const totalUsers = countResult[0].total;
    const [users] = await db.promise().query(
      `SELECT id, name, email, address, role, created_at
       FROM users
       ${whereClause}
       ORDER BY ${sortColumn} ${direction}, id DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
    );

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin user listing failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not get users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const [users] = await db.promise().query(
      "SELECT id, name, email, address, role FROM users WHERE id = ?",
      [req.params.id],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];
    if (user.role !== "STORE_OWNER") {
      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: { user },
      });
    }

    const [stores] = await db.promise().query(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.address,
         COALESCE(AVG(r.rating), 0) AS average_rating,
         COUNT(r.id) AS rating_count
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = ?
       GROUP BY s.id
       ORDER BY s.id DESC`,
      [user.id],
    );
    const [ratings] = await db.promise().query(
      `SELECT
         r.id,
         r.store_id,
         r.rating,
         r.created_at,
         u.id AS user_id,
         u.name AS user_name,
         u.email AS user_email,
         s.name AS store_name
       FROM ratings r
       JOIN stores s ON s.id = r.store_id
       JOIN users u ON u.id = r.user_id
       WHERE s.owner_id = ?
       ORDER BY r.id DESC`,
      [user.id],
    );

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        user,
        stores,
        ratings,
      },
    });
  } catch (error) {
    console.error("Admin user details query failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not get user",
    });
  }
};

const getAllAdminStores = async (req, res) => {
  const {
    search,
    address,
    sortBy = "id",
    sortOrder = "desc",
  } = req.query;
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
  const sortColumn = Object.hasOwn(allowedSortFields, sortBy)
    ? allowedSortFields[sortBy]
    : "s.id";
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

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  try {
    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM stores s ${whereClause}`,
      values,
    );
    const totalStores = countResult[0].total;
    const [stores] = await db.promise().query(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.address,
         s.owner_id,
         COALESCE(AVG(r.rating), 0) AS average_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${whereClause}
       GROUP BY s.id
       ORDER BY ${sortColumn} ${direction}, s.id DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset],
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
    console.error("Admin store listing failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not get stores",
    });
  }
};

module.exports = {
  getStats,
  createUser,
  getAllUsers,
  getUserById,
  getAllAdminStores,
};
