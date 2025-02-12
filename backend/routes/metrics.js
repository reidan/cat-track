const express = require("express");
const pool = require("../db");
const path = require("path");

const router = express.Router();

const USER_TIMEZONE = "America/Vancouver";

const QUERY_DAILY_SUMMARY = `
  SELECT 
    c.id AS cat_id,
    c.name AS cat_name,
    ROUND(SUM(f.calories), 2) AS total_calories
  FROM food_logs f
  JOIN cats c ON f.cat_id = c.id
  WHERE f.timestamp >= TIMEZONE($1, CURRENT_DATE) 
    AND f.timestamp < TIMEZONE($1, CURRENT_DATE + INTERVAL '1 day')
  GROUP BY c.id, c.name
  ORDER BY cat_name;
`;

const QUERY_WEEKLY_STATS = `
  SELECT 
    DATE(timestamp AT TIME ZONE $2) AS date,
    SUM(calories) AS total_calories,
    (SELECT calorie_goal FROM cats WHERE id=$1) AS calorie_goal
  FROM food_logs 
  WHERE cat_id=$1 AND Date(timestamp AT TIME ZONE $2) >= NOW() - INTERVAL '7 days' 
  GROUP BY date 
  ORDER BY date
`;

// Get daily summary of cat's calories
router.get("/daily-summary", async (req, res) => {
  try {
    const result = await pool.query(QUERY_DAILY_SUMMARY, [USER_TIMEZONE]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Get past week's food logs grouped by cat and day
router.get("/weekly-stats/:catId", async (req, res) => {
  const catId = Number(req.params.catId);

  try {
    const result = await pool.query(QUERY_WEEKLY_STATS,
      [catId, USER_TIMEZONE]
    );

    const formattedData = result.rows.reduce((acc, row) => {
      acc[row.date] = { calories: row.total_calories, goal: row.calorie_goal };
      return acc;
    }, {});

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
