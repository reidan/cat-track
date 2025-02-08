const express = require("express");
const pool = require("../db");

const router = express.Router();

// Get all food logs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM food_logs");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Get past week's food logs grouped by cat and day
router.get("/weekly/:catId", async (req, res) => {
  const catId = Number(req.params.catId);

  try {
    const result = await pool.query(
      `SELECT 
          DATE(timestamp) AS date,
          SUM(calories) AS total_calories,
          (SELECT calorie_goal FROM cats WHERE id=$1) AS calorie_goal
       FROM food_logs 
       WHERE cat_id=$1 AND timestamp >= NOW() - INTERVAL '7 days' 
       GROUP BY date 
       ORDER BY date`,
      [catId]
    );

    const formattedData = result.rows.reduce((acc, row) => {
      acc[row.date] = { calories: row.total_calories, goal: row.calorie_goal };
      return acc;
    }, {});

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Add a new food log
router.post("/", async (req, res) => {
  const { catId, foodId, quantity, calories } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO food_logs (cat_id, food_id, quantity, calories) VALUES ($1, $2, $3, $4) RETURNING *",
      [catId, foodId, quantity, calories]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});


// Update a food log
router.put("/:id", async (req, res) => {
  const { catId, foodId, quantity, calories } = req.body;
  const { id } = req.params;

  try {
    const query = "UPDATE cats SET cat_id=$1, food_id=$2, quantity=$3, calories=$4 WHERE id=$5 RETURNING *"
    
    const values = [catId, foodId, quantity, calories, id];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a food log
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM food_logs WHERE id=$1", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
