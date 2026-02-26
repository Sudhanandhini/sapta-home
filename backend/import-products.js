import fs from "fs";
import mysql from "mysql2/promise";

const filePath = process.argv[2];
if (!filePath) {
  console.log("Usage: node server/import-products.js server/import-products.json");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(filePath, "utf-8"));
const { db, products } = payload;

const run = async () => {
  const pool = mysql.createPool({ ...db, waitForConnections: true, connectionLimit: 5 });
  for (const item of products) {
    await pool.query(
      `INSERT INTO products (name, category, image_url, description, price, is_featured, meta)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        item.name,
        item.category,
        item.image_url || null,
        item.description || "",
        Number(item.price || 0),
        item.is_featured ? 1 : 0,
        item.meta || null,
      ],
    );
  }
  await pool.end();
  console.log(`Imported ${products.length} products`);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
