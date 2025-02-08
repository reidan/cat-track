const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const CATS_FILE = "cats.json";
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

// Load cat data
const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync(CATS_FILE, "utf8"));
  } catch (error) {
    return [];
  }
};

// Save cat data
const saveData = (data) => {
  fs.writeFileSync(CATS_FILE, JSON.stringify(data, null, 2));
};

// Get all cats
router.get("/", (req, res) => {
  const cats = loadData();
  res.json(cats);
});

// Add a new cat
router.post("/", upload.single("photo"), (req, res) => {
  const cats = loadData();

  const newCat = {
    id: Date.now(),
    name: req.body.name,
    birthday: req.body.birthday,
    calorieGoal: parseInt(req.body.calorieGoal, 10) || 0,
    photo: req.file ? `${UPLOADS_DIR}${req.file.filename}` : null,
  };

  cats.push(newCat);
  saveData(cats);
  res.status(201).json(newCat);
});

// Update an existing cat
router.put("/:id", upload.single("photo"), (req, res) => {
  const cats = loadData();
  const catIndex = cats.findIndex((cat) => cat.id === Number(req.params.id));

  if (catIndex === -1) {
    return res.status(404).json({ error: "Cat not found" });
  }

  const updatedCat = { ...cats[catIndex], ...req.body };

  if (req.file) {
    updatedCat.photo = `${UPLOADS_DIR}${req.file.filename}`;
  }

  updatedCat.calorieGoal = parseInt(req.body.calorieGoal, 10) || 0;
  cats[catIndex] = updatedCat;

  saveData(cats);
  res.json(updatedCat);
});

// Delete a cat
router.delete("/:id", (req, res) => {
  let cats = loadData();
  cats = cats.filter((cat) => cat.id !== Number(req.params.id));

  saveData(cats);
  res.status(204).send();
});

module.exports = router;
