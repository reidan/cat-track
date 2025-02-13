import api from "./apiClient";

// Fetch all food logs (with pagination & filters)
export const fetchFoodLogs = async ({ page = 1, limit = 10, catId, date }) => {
  const response = await api.get("/food-logs", {
    params: { page, limit, catId, date },
  });
  return response.data;
};

// Add a new food log
export const addFoodLog = async (foodLog) => {
  const response = await api.post("/food-logs", foodLog);
  return response.data;
};

// Edit a food log
export const updateFoodLog = async (foodLogId, formData) => {
  const response = await api.put(`/food-logs/${foodLogId}`, formData);
  return response.data;
};

// Delete a food log
export const deleteFoodLog = async (foodLogId) => {
  await api.delete(`/food-logs/${foodLogId}`);
};
