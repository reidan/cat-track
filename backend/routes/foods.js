const express = require("express");
const pool = require("../db");

const router = express.Router();

// Get all foods
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM foods ORDER BY name ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Add a new food
router.post("/", async (req, res) => {
  const { name, unit, calories } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO foods (name, unit, calories) VALUES ($1, $2, $3) RETURNING *",
      [name, unit, parseFloat(calories)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});


// Update an existing food
router.put("/:id", async (req, res) => {
  const { name, unit, calories } = req.body;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE foods SET name=$1, unit=$2, calories=$3 WHERE id=$4 RETURNING *",
      [name, unit, parseFloat(calories), id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a food
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM foods WHERE id=$1", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
