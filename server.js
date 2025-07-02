import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "test",
  user: process.env.DB_USER || "testuser",
  password: process.env.DB_PASSWORD || "password",
};

// Database connection
let connection;

// Database setup function
async function setupDatabase() {
  try {
    // Connect to MySQL server (without specifying database initially)
    const serverConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    // Create database if it doesn't exist
    await serverConnection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``
    );
    await serverConnection.end();

    // Connect to the specific database
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });

    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log(`✅ Database setup completed for: ${dbConfig.database}`);
    console.log(`📊 Connected to ${dbConfig.host}:${dbConfig.port}`);
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  }
}

// API Routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: dbConfig.database,
    host: dbConfig.host,
  });
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM users ORDER BY created_at DESC LIMIT 100"
    );
    res.json({
      users: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create new user
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const [result] = await connection.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );

    const [newUser] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already exists" });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  if (connection) {
    await connection.end();
    console.log("✅ Database connection closed");
  }
  process.exit(0);
});

// Start server
async function startServer() {
  await setupDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 API endpoints:`);
    console.log(`   GET    /api/health`);
    console.log(`   GET    /api/users`);
    console.log(`   GET    /api/users/:id`);
    console.log(`   POST   /api/users`);
    console.log(`   PUT    /api/users/:id`);
    console.log(`   DELETE /api/users/:id`);
  });
}

startServer().catch(console.error);
