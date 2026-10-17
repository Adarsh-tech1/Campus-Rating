const mysql = require("mysql2");
const { attachDatabasePool } = require("@vercel/functions");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
  maxIdle: Number(process.env.DB_MAX_IDLE || 1),
  idleTimeout: Number(process.env.DB_IDLE_TIMEOUT_MS || 60000),
  ssl:
    process.env.DB_SSL === "true"
      ? { minVersion: "TLSv1.2", rejectUnauthorized: true }
      : undefined,
});

if (process.env.VERCEL) attachDatabasePool(db);

module.exports = db;
