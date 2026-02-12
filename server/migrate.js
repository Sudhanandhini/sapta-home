import "dotenv/config";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "saptahome",
};

const run = async () => {
  const pool = mysql.createPool({ ...dbConfig, waitForConnections: true, connectionLimit: 5 });
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products' AND COLUMN_NAME = 'meta'`,
    [dbConfig.database],
  );
  const exists = rows?.[0]?.count > 0;
  if (!exists) {
    await pool.query("ALTER TABLE products ADD COLUMN meta JSON NULL");
    console.log("Added meta column to products table.");
  } else {
    console.log("Meta column already exists.");
  }
  await pool.end();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
