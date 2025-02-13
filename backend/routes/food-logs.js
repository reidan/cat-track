const express = require("express");
const pool = require("../db");

const router = express.Router();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api"; // Set dynamically if needed
const USER_TIMEZONE = "America/Vancouver";

const getWhereSQL = (whereClauses) => {
  return whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
};

const getQueryFoodLogs = (whereSQL, paramCount) => `
  SELECT 
    fl.id AS food_log_id,
    (fl.timestamp AT TIME ZONE $${paramCount-2}) AS timestamp,
    c.name AS cat_name,
    fl.cat_id AS cat_id,
    f.name AS food_name,
    fl.food_id AS food_id,
    f.unit AS unit,
    fl.quantity AS quantity,
    ROUND(fl.calories, 2) AS calories
  FROM food_logs fl
  INNER JOIN cats c ON c.id = fl.cat_id
  INNER JOIN foods f ON f.id = fl.food_id
  ${whereSQL}
  ORDER BY fl.timestamp DESC
  LIMIT $${paramCount-1} OFFSET $${paramCount}
`;

const getTotalFoodLogs = (whereSQL) => `
  SELECT COUNT(*) 
  FROM food_logs fl 
  INNER JOIN cats c ON fl.cat_id = c.id
   ${whereSQL}
`;

// Generate pagination links
const getPageLinks = (page, totalPages, limit, date, catId) => {
  const queryParamsString = new URLSearchParams({ limit, date, catId }).toString();
  const links = {
    self: `${API_BASE_URL}/food-logs?page=${page}&${queryParamsString}`,
  };
  if (page < totalPages) {
    links.next = `${API_BASE_URL}/food-logs?page=${page + 1}&${queryParamsString}`;
  }
  if (page > 1) {
    links.previous = `${API_BASE_URL}/food-logs?page=${page - 1}&${queryParamsString}`
  }
  return links;
};

// Get all food logs
router.get("/", async (req, res) => {
  try {
    let { page, limit, date, catId } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10; // Default: 10 logs per page
    const offset = (page - 1) * limit;

    let whereClauses = [];
    let queryParams = [];

    if (date) {
      const paramCount = queryParams.length;
      whereClauses.push(`fl.timestamp >= TIMEZONE($${paramCount + 1}, Date($${paramCount + 2}))`);
      whereClauses.push(`fl.timestamp < TIMEZONE($${paramCount + 1}, Date($${paramCount + 2}) + INTERVAL '1 day')`);
      queryParams.push(USER_TIMEZONE, date);
    }

    if (catId) {
      whereClauses.push(`c.id = $${queryParams.length + 1}`);
      queryParams.push(catId);
    }

    const whereSQL = getWhereSQL(whereClauses);

    // Count total logs for pagination
    const totalQuery = await pool.query(getTotalFoodLogs(whereSQL), queryParams);
    const totalLogs = parseInt(totalQuery.rows[0].count);
    const totalPages = Math.ceil(totalLogs / limit);

    queryParams.push(USER_TIMEZONE, limit, offset);

    const foodLogQuery = getQueryFoodLogs(whereSQL, queryParams.length);
    const { rows } = await pool.query(foodLogQuery, queryParams);
    res.json({
      page,
      totalPages,
      totalLogs,
      logs: rows,
      links: getPageLinks(page, totalPages, catId, date),
    });
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
    const foodLogId = parseInt(id);
    const query = "UPDATE food_logs SET cat_id=$1, food_id=$2, quantity=$3, calories=$4 WHERE id=$5 RETURNING *"
    
    const values = [catId, foodId, quantity, calories, id];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a food log
router.delete("/:id", async (req, res) => {
  try {
    const foodLogId = parseInt(req.params.id);
    await pool.query("DELETE FROM food_logs WHERE id=$1", [foodLogId]);
    res.status(204).send();
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
