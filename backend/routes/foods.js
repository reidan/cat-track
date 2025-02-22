const express = require("express");
const {
  getFoods, 
  addFood,
  updateFood,
  deleteFood,
  toggleFavorite
} = require("../services/foods");

const router = express.Router();

// Get all foods
router.get("/", async (req, res) => {
  try {
    const foods = await getFoods(req.query.name);
    res.json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new food
router.post("/", async (req, res) => {
  try {
    const food = await addFood(req.body);
    res.status(201).json(food);
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update an existing food
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const food = await updateFood(id, req.body);
    res.json(food);
  } catch (error) {
    console.error("Error updating food:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a food
router.delete("/:id", async (req, res) => {
  try {
    const deletedFood = deleteFood(req.params.id);
    res.status(204).send(deletedFood);
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/favorite", async (req, res) => {
  try {
    const updatedFood = await toggleFavorite(req.params.id);
    res.json(updatedFood);
  } catch (error) {
    console.error("Error updating favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
