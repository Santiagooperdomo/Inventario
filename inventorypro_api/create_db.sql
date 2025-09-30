-- crea la base de datos y la tabla
CREATE DATABASE IF NOT EXISTS inventorydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventorydb;
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) DEFAULT NULL,
    quantity INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
