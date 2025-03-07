import { useBackendStatus } from "../contexts/BackendStatusContext";

const BackendStatusBanner = () => {
  const isBackendAvailable = useBackendStatus();

  if (isBackendAvailable) return null; // ✅ Hide if backend is available

  return (
    <div className="bg-red-500 text-white text-center py-2 fixed top-0 w-full z-50">
      ⚠️ Backend is down. Data may be outdated.
    </div>
  );
};

export default BackendStatusBanner;
