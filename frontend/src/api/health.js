import api from "./apiClient";

// Fetch weekly food logs for a cat
export const getHealth = async () => {
  const response = await api.get(`/health`);
  return response;
};
