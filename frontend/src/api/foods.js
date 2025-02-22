import api from "./apiClient";

// Fetch all foods (with optional filtering)
export const fetchFoods = async (nameFilter = "") => {
  const response = await api.get("/foods", { params: { name: nameFilter } });
  return response.data.map(({ calories_per_unit, ...food }) => ({
    ...food,
    calories: calories_per_unit,
  }));
};

// Add a new food
export const addFood = async (formData) => {
  const response = await api.post("/foods", formData);
  return response.data;
};

// Edit a food
export const updateFood = async (foodId, formData) => {
  const response = await api.put(`/foods/${foodId}`, formData);
  return response.data;
};

// Toggle favorite
export const toggleFavorite = async (foodId) => {
  const response = await api.patch(`/foods/${foodId}/favorite`);
  return response.data;
};

// Delete a food
export const deleteFood = async (foodId) => {
  await api.delete(`/foods/${foodId}`);
};

