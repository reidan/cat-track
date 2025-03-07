const express = require("express");
const router = express.Router();
const { query } = require("../db/db"); // ✅ Import database connection

router.get("/", async (req, res) => {
  try {
    // ✅ Check if the database responds
    await query("SELECT 1");
    res.status(200).json({ status: "healthy", database: "connected" });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ status: "unhealthy", database: "disconnected" });
  }
});

module.exports = router;
