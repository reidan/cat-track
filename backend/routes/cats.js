const express = require("express");
const pool = require("../db");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const UPLOADS_DIR = "uploads/";

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all cats
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cats");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a new cat
router.post("/", upload.single("photo"), async (req, res) => {
  const { name, birthday, calorieGoal } = req.body;
  const photo = req.file ? `${UPLOADS_DIR}${req.file.filename}` : null;

  try {
    const result = await pool.query(
      "INSERT INTO cats (name, birthday, calorie_goal, photo) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, birthday, calorieGoal || 0, photo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Update a cat
router.put("/:id", upload.single("photo"), async (req, res) => {
  const { name, birthday, calorieGoal } = req.body;
  const photo = req.file ? `${UPLOADS_DIR}${req.file.filename}` : null;
  const { id } = req.params;

  try {
    const query = photo
      ? "UPDATE cats SET name=$1, birthday=$2, calorie_goal=$3, photo=$4 WHERE id=$5 RETURNING *"
      : "UPDATE cats SET name=$1, birthday=$2, calorie_goal=$3 WHERE id=$4 RETURNING *";
    const values = photo ? [name, birthday, calorieGoal || 0, photo, id] : [name, birthday, calorieGoal || 0, id];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a cat
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM cats WHERE id=$1", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
