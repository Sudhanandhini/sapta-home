import "dotenv/config";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 ? args[idx + 1] : undefined;
};

const email = getArg("email");
const password = getArg("password");

if (!email || !password) {
  console.log("Usage: npm run admin:create -- --email admin@example.com --password YourPassword");
  process.exit(1);
}

const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "saptahome",
};

const run = async () => {
  const pool = mysql.createPool({ ...dbConfig, waitForConnections: true, connectionLimit: 5 });
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin') ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)",
    [email, hash],
  );
  console.log(`Admin user ensured for ${email}`);
  await pool.end();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
