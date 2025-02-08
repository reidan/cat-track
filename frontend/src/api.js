import axios from "axios";

const API_URL = __API_URL__; // Defined in vite.config.js

const api = axios.create({
  baseURL: API_URL,
});

// Fetch all cats
export const fetchCats = async () => {
  const response = await api.get("/cats");
  return response.data;
};

// Fetch weekly food logs for a cat
export const fetchWeeklyFoodLogs = async (catId) => {
  const response = await api.get(`/food-logs/weekly/${catId}`);
  return response.data;
};

// Fetch all foods
export const fetchFoods = async () => {
  const response = await api.get("/foods");
  return response.data;
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

// Add a new food log
export const addFoodLog = async (foodLog) => {
  const response = await api.post("/food-logs", foodLog);
  return response.data;
};

// Delete a food log
export const deleteFoodLog = async (foodLogId) => {
  await api.delete(`/food-logs/${foodLogId}`);
};

// Fetch all food logs
export const fetchFoodLogs = async () => {
  const response = await api.get("/food-logs");
  return response.data;
};

export default api;
