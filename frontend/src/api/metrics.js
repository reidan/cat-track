import api from "./apiClient";

// Fetch weekly food logs for a cat
export const fetchWeeklyFoodLogs = async (catId) => {
  const response = await api.get(`/metrics/weekly-stats/${catId}`);
  return response.data;
};

// Fetch daily food summary for all cats
export const fetchDailySummary = async (date) => {
  const response = await api.get(`/metrics/daily-summary/${date}`);
  return response.data;
};
