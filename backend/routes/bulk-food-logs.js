const express = require("express");
const router = express.Router();
const pool = require("../db"); // PostgreSQL connection

router.post("/upload", async (req, res) => {
  try {
    const foodLogs = req.body;
    
    if (!Array.isArray(foodLogs) || foodLogs.length === 0) {
      return res.status(400).json({ error: "Invalid data format. Expected an array." });
    }

    const values = foodLogs
      .filter((log) => log.valid)
      .map(({ catId, foodId, quantity, calories, timestamp }) =>
        `(${catId}, ${foodId}, ${quantity}, ${calories}, '${timestamp}')`
      )
      .join(",");

    if (values.length === 0) {
      return res.status(400).json({ error: "No valid records to insert." });
    }

    const query = `
      INSERT INTO food_logs (cat_id, food_id, quantity, calories, timestamp)
      VALUES ${values} RETURNING *;
    `;

    const result = await pool.query(query);
    res.json({ count: result.rowCount, data: result.rows });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ error: "Failed to upload food logs." });
  }
});

module.exports = router;
