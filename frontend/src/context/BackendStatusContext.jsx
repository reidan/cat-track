import { createContext, useContext, useEffect, useState } from "react";

import { Health } from "../api";
const { getHealth } = Health;

const BackendStatusContext = createContext();

export const BackendStatusProvider = ({ children }) => {
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);

  const checkBackend = async () => {
    try {
      const response = await getHealth();
      setIsBackendAvailable(response.ok);
    } catch (error) {
      console.error("⚠️ Backend is unavailable:", error);
      setIsBackendAvailable(false);
    }
  };

  useEffect(() => {
    checkBackend(); // ✅ Check once when the app loads
    const interval = setInterval(checkBackend, 30000); // ✅ Check every 30 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <BackendStatusContext.Provider value={isBackendAvailable}>
      {children}
    </BackendStatusContext.Provider>
  );
};

export const useBackendStatus = () => useContext(BackendStatusContext);
