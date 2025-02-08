import axios from "axios";

const API_URL = __API_URL__; // Defined in vite.config.js

const api = axios.create({
  baseURL: API_URL,
});

//  CATSSSSSS

// Fetch all cats
export const fetchCats = async () => {
  const response = await api.get("/cats");
  const cats = response.data.map(({calorie_goal, ...cat}) => {
    ...cat,
    calorieGoal: calorie_goal,
  })
  return cats;
};

// Add a new cat
export const addCat = async (formData) => {
  const response = await api.post("/cats", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Edit a cat
export const updateCat = async (catId, formData) => {
  const response = await api.put(`/cats/${catId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete a cat
export const deleteCat = async (catId) => {
  await api.delete(`/cats/${catId}`);
};

//  FOOOOOODS

// Fetch all foods
export const fetchFoods = async () => {
  const response = await api.get("/foods");
  const foods = response.data.map(({calories_per_unit, ...food}) => {
    ...food,
    calories: calories_per_unit,
  })
  return foods;
};

// Add a new food
export const addFood = async (formData) => {
  const response = await api.post("/foods", formData);
  return response.data;
};

// Edit a food
export const putFood = async (foodId, formData) => {
  const response = await api.put(`/foods/${foodId}`, formData);
  return response.data;
};

// Delete a food
export const deleteFood = async (foodId) => {
  await api.delete(`/foods/${foodId}`);
};

// FOOD LOGSSSS

// Fetch weekly food logs for a cat
export const fetchWeeklyFoodLogs = async (catId) => {
  const response = await api.get(`/food-logs/weekly/${catId}`);
  return response.data;
};

// Fetch all food logs
export const fetchFoodLogs = async () => {
  const response = await api.get("/food-logs");
  return response.data;
};

// Add a new food log
export const addFoodLog = async (foodLog) => {
  const response = await api.post("/food-logs", foodLog);
  return response.data;
};

// Edit a food
export const updateFoodLog = async (foodLogId, formData) => {
  const response = await api.put(`/food-logs/${foodLogId}`, formData);
  return response.data;
};

// Delete a food log
export const deleteFoodLog = async (foodLogId) => {
  await api.delete(`/food-logs/${foodLogId}`);
};

export default api;
