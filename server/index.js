import "dotenv/config";
import express from "express";
import mysql from "mysql2/promise";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const uploadsDir = path.resolve("server", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${base}-${unique}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "saptahome",
};

let pool;
const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({ ...dbConfig, waitForConnections: true, connectionLimit: 10 });
  }
  return pool;
};

const normalizeMetaForDb = (meta) => {
  if (meta == null) return null;
  if (typeof meta === "string") return meta;
  try {
    return JSON.stringify(meta);
  } catch {
    return null;
  }
};

const parseMetaFromDb = (row) => ({
  ...row,
  meta: typeof row.meta === "string" ? JSON.parse(row.meta || "null") : row.meta,
});

const jwtSecret = process.env.JWT_SECRET || "change_this_secret";
const cookieName = "auth_token";

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: "7d" });

const authMiddleware = (req, res, next) => {
  const token = req.cookies[cookieName];
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const [rows] = await getPool().query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    const user = rows?.[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.cookie(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login failed" });
  }
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie(cookieName);
  res.json({ message: "Logged out" });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

app.post("/api/auth/request-reset", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email required" });
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 30);
    await getPool().query(
      "UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?",
      [token, expires, email],
    );
    console.log(`Password reset token for ${email}: ${token}`);
    res.json({ message: "Reset link generated. Check server logs for token." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to request reset" });
  }
});

app.post("/api/auth/reset", async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ message: "Token and password required" });
    const [rows] = await getPool().query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW() LIMIT 1",
      [token],
    );
    const user = rows?.[0];
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });
    const hash = await bcrypt.hash(password, 10);
    await getPool().query(
      "UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
      [hash, user.id],
    );
    res.json({ message: "Password updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const { category, featured, minPrice, maxPrice, search } = req.query;
    const where = [];
    const params = [];

    if (category) {
      where.push("category = ?");
      params.push(category);
    }
    if (featured === "true") {
      where.push("is_featured = 1");
    }
    if (minPrice) {
      where.push("price >= ?");
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      where.push("price <= ?");
      params.push(Number(maxPrice));
    }
    if (search) {
      where.push("(name LIKE ? OR description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [rows] = await getPool().query(
      `SELECT id, name, category, image_url, description, price, is_featured, meta
       FROM products
       ${whereClause}
       ORDER BY id DESC`,
      params,
    );
    res.json(rows.map(parseMetaFromDb));
  } catch (error) {
    console.error(error);
    if (error?.code === "ER_BAD_FIELD_ERROR") {
      return res.status(500).json({
        message: "Database schema missing required columns.",
        details: "Run: ALTER TABLE products ADD COLUMN meta JSON NULL;",
      });
    }
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows] = await getPool().query(
      "SELECT id, name, category, image_url, description, price, is_featured, meta FROM products WHERE id = ?",
      [req.params.id],
    );
    if (!rows?.[0]) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(parseMetaFromDb(rows[0]));
  } catch (error) {
    console.error(error);
    if (error?.code === "ER_BAD_FIELD_ERROR") {
      return res.status(500).json({
        message: "Database schema missing required columns.",
        details: "Run: ALTER TABLE products ADD COLUMN meta JSON NULL;",
      });
    }
    return res.status(500).json({ message: "Failed to fetch product" });
  }
});

app.get("/api/products/:id/related", async (req, res) => {
  try {
    const [productRows] = await getPool().query("SELECT category FROM products WHERE id = ?", [req.params.id]);
    const category = productRows?.[0]?.category;
    const [rows] = await getPool().query(
      `SELECT id, name, category, image_url, description, price, is_featured
       FROM products
       WHERE (? IS NULL OR category = ?) AND id != ?
       ORDER BY id DESC
       LIMIT 6`,
      [category || null, category || null, req.params.id],
    );
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch related products" });
  }
});

app.get("/api/categories", async (_req, res) => {
  try {
    const [rows] = await getPool().query(
      "SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY category",
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

app.post("/api/products", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { name, category, image_url, description, price, is_featured, meta } = req.body || {};
    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }
    const metaValue = normalizeMetaForDb(meta);
    const [result] = await getPool().query(
      `INSERT INTO products (name, category, image_url, description, price, is_featured, meta)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, category, image_url || null, description || "", Number(price || 0), is_featured ? 1 : 0, metaValue],
    );
    const [rows] = await getPool().query("SELECT * FROM products WHERE id = ?", [result.insertId]);
    res.status(201).json(rows?.[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

app.post("/api/uploads", authMiddleware, requireAdmin, upload.array("images", 6), (req, res) => {
  const files = req.files || [];
  const urls = files.map((file) => `/uploads/${file.filename}`);
  res.json({ urls });
});

app.put("/api/products/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, image_url, description, price, is_featured, meta } = req.body || {};
    const metaValue = normalizeMetaForDb(meta);
    await getPool().query(
      `UPDATE products
       SET name = ?, category = ?, image_url = ?, description = ?, price = ?, is_featured = ?, meta = ?
       WHERE id = ?`,
      [name, category, image_url || null, description || "", Number(price || 0), is_featured ? 1 : 0, metaValue, id],
    );
    const [rows] = await getPool().query("SELECT * FROM products WHERE id = ?", [id]);
    res.json(rows?.[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

app.delete("/api/products/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await getPool().query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

const port = process.env.PORT || 5176;
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
