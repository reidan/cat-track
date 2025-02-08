const express = require("express");
const fs = require("fs");
const router = express.Router();

const FOODS_FILE = "foods.json";

// Load food data
const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync(FOODS_FILE, "utf8"));
  } catch (error) {
    return [];
  }
};

// Save food data
const saveData = (data) => {
  fs.writeFileSync(FOODS_FILE, JSON.stringify(data, null, 2));
};

// Get all foods
router.get("/", (req, res) => {
  const foods = loadData();
  res.json(foods);
});

// Add a new food
router.post("/", (req, res) => {
  const foods = loadData();
  const newFood = {
    id: Date.now(),
    name: req.body.name,
    unit: req.body.unit,
    calories: parseFloat(req.body.calories).toFixed(3), // Ensure decimal formatting
  };

  foods.push(newFood);
  saveData(foods);
  res.status(201).json(newFood);
});

// Update food
router.put("/:id", (req, res) => {
  const foods = loadData();
  const foodIndex = foods.findIndex((food) => food.id === Number(req.params.id));

  if (foodIndex === -1) {
    return res.status(404).json({ error: "Food not found" });
  }

  foods[foodIndex] = {
    ...foods[foodIndex],
    ...req.body,
    calories: parseFloat(req.body.calories).toFixed(3), // Ensure decimal formatting
  };

  saveData(foods);
  res.json(foods[foodIndex]);
});

// Delete food
router.delete("/:id", (req, res) => {
  let foods = loadData();
  foods = foods.filter((food) => food.id !== Number(req.params.id));

  saveData(foods);
  res.status(204).send();
});

module.exports = router;
