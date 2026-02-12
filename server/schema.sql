CREATE DATABASE IF NOT EXISTS saptahome;
USE saptahome;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  reset_token VARCHAR(255),
  reset_expires TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_featured TINYINT(1) DEFAULT 0,
  meta JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, image_url, description, price, is_featured)
VALUES
  ("Luxury Bed Cover", "Bed Cover", "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop", "Soft woven bed cover with premium finish.", 125.60, 1),
  ("Classic Apron Set", "Apron", "https://images.unsplash.com/photo-1582515073490-399813fca49f?q=80&w=1200&auto=format&fit=crop", "Durable, easy-care apron set.", 46.00, 0),
  ("Floral Cushion", "Cushion", "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop", "Comfort cushions with vibrant prints.", 78.25, 1);
