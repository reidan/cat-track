const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

// Allow only the frontend's domain
const allowedOrigins = [
  "https://cat-track-frontend.onrender.com", // Replace with your actual frontend URL
  "http://localhost:5173" // Allow local development
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ Allows cookies & auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allow all necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow common headers
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Remove Cache
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// Import route files
const catsRoutes = require("./routes/cats");
const foodsRoutes = require("./routes/foods");
const foodLogsRoutes = require("./routes/food-logs");
const metricsRoutes = require("./routes/metrics");
const bulkFoodLogsRoutes = require("./routes/bulk-food-logs");

// Use routes
app.use("/api/cats", catsRoutes);
app.use("/api/foods", foodsRoutes);
app.use("/api/food-logs", foodLogsRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/bulk-food-logs", bulkFoodLogsRoutes);

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// ✅ Handle preflight requests (for OPTIONS method)
app.options("*", cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
