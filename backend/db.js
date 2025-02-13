const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Logging queries and handling errors
const query = async (text, params) => {
  try {
    console.log("📥 Executing Query:", text);
    if (params && params.length > 0) {
      console.log("🔹 Parameters:", params);
    }

    const start = Date.now(); // Measure execution time
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    console.log("✅ Query Successful (Duration:", duration + "ms)", "\n");
    return res;
  } catch (error) {
    console.error("❌ Query Failed:", text);
    console.error("🔴 Error Message:", error.message, "\n");
    throw error; // Re-throw error for handling in routes
  }
};

module.exports = { query, pool };
