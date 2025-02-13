import api from "./apiClient";

// Fetch all foods
export const fetchFoods = async () => {
  const response = await api.get("/foods");
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

// Delete a food
export const deleteFood = async (foodId) => {
  await api.delete(`/foods/${foodId}`);
};
