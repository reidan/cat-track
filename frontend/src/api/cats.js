import api from "./apiClient";

// Fetch all cats
export const fetchCats = async () => {
  const response = await api.get("/cats");
  return response.data.map(({ calorie_goal, ...cat }) => ({
    ...cat,
    calorieGoal: calorie_goal,
  }));
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
