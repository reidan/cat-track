const { query } = require("../db");

const getFoods = async (nameFilter) => {
  let whereClause = "";
  let queryParams = [];

  if (nameFilter) {
    whereClause = "WHERE LOWER(name) LIKE $1";
    queryParams.push(`%${nameFilter.toLowerCase()}%`);
  }

  const { rows } = await query(
    `SELECT id, name, unit, calories_per_unit, favorite FROM foods ${whereClause} ORDER BY name ASC;`,
    queryParams
  );

  return rows;
};

const addFood = async (food) => {
  const { name, unit, calories } = food;
  
  try {
    const { rows } = await query(
      `INSERT INTO foods (name, unit, calories_per_unit) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, unit, calories]
    );
    return rows[0];
  } catch (error) {
    if (error.code === "23505") { // PostgreSQL unique constraint violation
      throw new Error("A food with this name already exists.");
    }
    throw error;
  }
};

const updateFood = async (foodId, food) {
  const { name, unit, calories } = food;
  try {
    const { rows } = await query(
      "UPDATE foods SET name=$1, unit=$2, calories_per_unit=$3 WHERE id=$4 RETURNING *",
      [name, unit, parseFloat(calories), foodId]
    );
    return rows[0];
  } catch (error) {
    if (error.code === "23505") { // PostgreSQL unique constraint violation
      throw new Error("A food with this name already exists.");
    }
    throw error;
  }

};

const deleteFood = async (foodId) {
  const { rows } = await query(
    "DELETE FROM foods WHERE id=$1",
    [foodId]
  );
  return rows[0];
};

const toggleFavorite = async (foodId) => {
  const { rows } = await query(
    `UPDATE foods SET favorite = NOT favorite WHERE id = $1 RETURNING favorite;`,
    [foodId]
  );
  return rows[0];
};

module.exports = {
  getFoods, 
  addFood,
  updateFood,
  deleteFood,
  toggleFavorite
};
