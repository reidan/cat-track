const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import route files
const catsRoutes = require("./routes/cats");
const foodsRoutes = require("./routes/foods");
const foodLogsRoutes = require("./routes/food-logs");

// Use routes
app.use("/api/cats", catsRoutes);
app.use("/api/foods", foodsRoutes);
app.use("/api/food-logs", foodLogsRoutes);

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
