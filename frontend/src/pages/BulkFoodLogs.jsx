import { useState, useEffect } from "react";
import { fetchCats, fetchFoods, bulkUpdateLogs } from "../api";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function BulkFoodLogs() {
  const [jsonData, setJsonData] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [status, setStatus] = useState(null);
  const [cats, setCats] = useState({});
  const [foods, setFoods] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // Fetch cats and foods for name-to-ID mapping
    const fetchData = async () => {
      try {
        const catsRes = await fetchCats();
        const foodsRes = await fetchFoods();

        const catMap = Object.fromEntries(catsRes.data.map(cat => [cat.name.toUpperCase(), cat.id]));
        const foodMap = Object.fromEntries(foodsRes.data.map(food => [food.name.toUpperCase(), food.id]));

        setCats(catMap);
        setFoods(foodMap);
      } catch (error) {
        console.error("Failed to fetch lookup data:", error);
      }
    };
    fetchData();
  }, []);

  const handleParse = () => {
    try {
      const data = JSON.parse(jsonData);

      if (!Array.isArray(data)) {
        throw new Error("Invalid JSON: Expected an array of objects.");
      }

      const formattedData = data.map((entry) => {
        const catId = cats[entry.catId.toUpperCase()] || "Not Found";
        const foodId = foods[entry.foodId.toUpperCase()] || "Not Found";

        return {
          ...entry,
          catId,
          foodId,
          valid: catId !== "Not Found" && foodId !== "Not Found",
        };
      });

      setParsedData(formattedData);
      setIsConfirmed(false);
      setStatus(null);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Invalid JSON format." });
    }
  };

  const handleUpload = async () => {
    if (!isConfirmed) {
      setIsConfirmed(true);
      return;
    }

    const validData = parsedData.filter((entry) => entry.valid);

    try {
      const response = bulkUpdateLogs(validData);

      setStatus({ type: "success", message: `Successfully uploaded ${response.data.count} records!` });
      setParsedData([]);
      setJsonData("");
    } catch (error) {
      setStatus({ type: "error", message: "Failed to upload data." });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📤 Bulk Upload Food Logs</h2>
      
      <textarea
        className="w-full h-40 p-2 border rounded"
        placeholder="Paste your JSON data here..."
        value={jsonData}
        onChange={(e) => setJsonData(e.target.value)}
      />

      <button className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={handleParse}>
        Preview Data
      </button>

      {parsedData.length > 0 && (
        <>
          <h3 className="text-xl font-bold mt-4">Preview</h3>
          <table className="w-full mt-2 border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Cat Name</th>
                <th className="border p-2">Food Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Calories</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {parsedData.map((entry, index) => (
                <tr key={index} className={entry.valid ? "bg-green-100" : "bg-red-100"}>
                  <td className="border p-2">{entry.catId !== "Not Found" ? entry.catId : "❌ " + entry.catId}</td>
                  <td className="border p-2">{entry.foodId !== "Not Found" ? entry.foodId : "❌ " + entry.foodId}</td>
                  <td className="border p-2">{entry.quantity} {entry.unit}</td>
                  <td className="border p-2">{entry.calories}</td>
                  <td className="border p-2">{entry.valid ? "✅ Valid" : "❌ Missing ID"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className={`mt-4 px-4 py-2 rounded text-white ${
              isConfirmed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500"
            }`}
            onClick={handleUpload}
            disabled={parsedData.every((entry) => !entry.valid)}
          >
            {isConfirmed ? "Confirm Upload" : "Upload Data"}
          </button>
        </>
      )}

      {status && (
        <div className={`mt-4 p-2 text-white rounded ${status.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default BulkFoodLogs;
