import api from "./apiClient";

// Bulk upload food logs
export const bulkUpdateLogs = async (data) => {
  return await api.post("/bulk-food-logs/upload", data, {
    headers: { "Content-Type": "application/json" },
  });
};
  