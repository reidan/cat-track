const express = require("express");
const fs = require("fs");
const router = express.Router();

const CATS_FILE = "cats.json";
const FOOD_LOGS_FILE = "foodLogs.json";

const loadData = (file) => {
  // try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  // } catch (error) {
  //   return [];
  // }
};

const saveData = (data) => {
  fs.writeFileSync(FOOD_LOGS_FILE, JSON.stringify(data, null, 2));
};

// Get all food logs
router.get("/", (req, res) => res.json(loadData(FOOD_LOGS_FILE)));


// Get past week's food logs grouped by cat and day
router.get("/weekly/:catId", (req, res) => {
  const foodLogs = loadData(FOOD_LOGS_FILE);
  const cats = loadData(CATS_FILE);

  const catId = req.params.catId;
  const cat = cats.find((c) => `${c.id}` === catId);
  if (!cat) return res.status(404).json({ error: "Cat not found" });

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const filteredLogs = foodLogs
    .filter((log) => `${log.catId}` === catId && new Date(log.timestamp) >= oneWeekAgo)
    .reduce((acc, log) => {
      const date = (new Date(log.timestamp)).toLocaleDateString();
      if (!acc[date]) acc[date] = { calories: 0, goal: cat.calorieGoal };
      acc[date].calories += log.calories;
      return acc;
    }, {});

  res.json(filteredLogs);
});

// Add a new food log
router.post("/", (req, res) => {
  const logs = loadData(FOOD_LOGS_FILE);
  const newLog = {
    id: Date.now(),
    catId: Number(req.body.catId),
    foodId: Number(req.body.foodId),
    quantity: parseFloat(req.body.quantity),
    unit: req.body.unit,
    calories: parseFloat(req.body.calories),
    timestamp: new Date().toISOString(),
  };
  logs.push(newLog);
  saveData(logs);
  res.json(newLog);
});

// Update a food log
router.put("/:id", (req, res) => {
  const logs = loadData(FOOD_LOGS_FILE);
  const logIndex = logs.findIndex((log) => log.id === Number(req.params.id));

  if (logIndex === -1) return res.status(404).json({ error: "Log not found" });

  logs[logIndex] = { ...logs[logIndex], ...req.body };
  saveData(logs);
  res.json(logs[logIndex]);
});


// Delete food
router.delete("/:id", (req, res) => {
  let logs = loadData(FOOD_LOGS_FILE);
  logs = logs.filter((log) => log.id !== Number(req.params.id));

  saveData(logs);
  res.status(204).send();
});

module.exports = router;
