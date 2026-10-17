const path = require("path");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const main = async () => {
  const required = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "ADMIN_NAME",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
  ];
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const name = process.env.ADMIN_NAME.trim();
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (name.length < 20 || name.length > 60) {
    throw new Error("ADMIN_NAME must be between 20 and 60 characters.");
  }
  if (password.length < 8 || password.length > 16 || !/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    throw new Error("ADMIN_PASSWORD must be 8–16 characters and include an uppercase letter and a special character.");
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl:
      process.env.DB_SSL === "true"
        ? { minVersion: "TLSv1.2", rejectUnauthorized: true }
        : undefined,
  });

  try {
    const [existing] = await connection.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (existing.length) {
      throw new Error(`An account already exists for ${email}.`);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await connection.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'ADMIN')",
      [name, email, passwordHash],
    );
    console.log(`Administrator account created for ${email}.`);
  } finally {
    await connection.end();
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
