import { useEffect, useState } from "react";
import {
  fetchFoods,
  fetchCats,
  fetchFoodLogs,
  addFoodLog,
  updateFoodLog,
  deleteFoodLog
} from "../api";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

function FoodLogs() {
  const getTodayDate = () => new Date().toLocaleDateString(); // Format: YYYY-MM-DD

  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState({ self: "", next: null, previous: null });
  
  const [cats, setCats] = useState([]);
  const [foods, setFoods] = useState([]);

  // Applied filters (Only updates when "Apply Filters" is clicked)
  const [filters, setFilters] = useState({ catId: "", date: getTodayDate() });

  // Temporary filters (Updates when user selects values but before applying)
  const [tempFilters, setTempFilters] = useState({ catId: "", date: getTodayDate() });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);


  const limit = 10;

  useEffect(() => {
    fetchCats().then((data) => { setCats(data) });
    fetchFoods().then((data) => { setFoods(data) });
  });

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching logs with:", { page, limit, ...filters });
      fetchFoodLogs({ 
        page, 
        limit: 10, 
        catId: filters.catId || null, 
        date: filters.date || null,
      }).then(({logs, totalPages, links}) => {
        setLogs(logs);
        setTotalPages(totalPages);
        setPaginationLinks(links);
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching food logs:", error);
        toast.error("Failed to fetch logs.");
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching food logs:", error);
      toast.error("Failed to fetch logs.");
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    setFilters(tempFilters);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short", // "Feb"
      day: "numeric", // "11"
      hour: "numeric", // "4"
      minute: "2-digit", // "30"
      hour12: true, // "AM/PM"
    }).format(date).replace(",", " @");
  };


  // Open modal for adding a new log
  const openAddModal = () => {
    setIsAdding(true);
    setEditingLog({ catId: "", foodId: "", quantity: "", unit: "", calories: 0 });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing log
  const openEditModal = ({cat_id, food_id, ...log}) => {
    console.log(`EDIT THIS: ${JSON.stringify(log, null, 2)} + ${cat_id} + ${food_id}`);
    setIsAdding(false);
    setEditingLog({
      ...log,
      catId: cat_id,
      foodId: food_id,
    });
    setIsModalOpen(true);
  };

  // Handle input change and update calories dynamically
  const updateLog = (field, value) => {
    if (!editingLog) return;

    let updatedLog = { ...editingLog, [field]: value };

    // Auto-update unit and calories when food is selected
    if (field === "foodId") {
      const food = foods.find((f) => f.id === Number(value));
      if (food) {
        updatedLog.unit = food.unit;
        updatedLog.calories = food.calories * parseFloat(updatedLog.quantity || 0);
      }
    }

    // Recalculate calories when quantity changes
    if (field === "quantity") {
      const food = foods.find((f) => f.id === Number(editingLog.foodId));
      if (food) {
        updatedLog.calories = food.calories * parseFloat(value);
      }
    }

    setEditingLog(updatedLog);
  };

  const handleSuccessfulSave = (addMore = false) => {
    if (addMore) {
      setEditingLog({ ...editingLog, quantity: 0, calories: 0 });
    } else {
      setIsModalOpen(false);
      setEditingLog(null);
      fetchLogs();
    }
  };

  // Save new or edited food log
  const saveLog = async (addMore = false) => {
    if (!editingLog || !editingLog.catId || !editingLog.foodId || editingLog.quantity <= 0) return;

    let response;
    if (isAdding) {
      addFoodLog({
        ...editingLog,
        timestamp: new Date().toISOString(),
      }).then(() => {
        handleSuccessfulSave();
        toast.success("✅ Food log added!");
      }).catch((e) => {
        console.log(`ERROR during add: ${e}`);
        toast.error("❌ Failed to add log.");
      });
    } else {
      updateFoodLog(editingLog.food_log_id, editingLog).then(
        (data) => {
          handleSuccessfulSave();
          toast.success("✏️ Food log updated!");
      }).catch((e) => {
        console.log(`ERROR during update: ${e}`);
        toast.error("❌ Failed to update log.");
      });
    }
  };

  // Delete food log
  const deleteLog = async (id) => {
    console.log(`DELETE THIS: ${id}`);
    const isConfirmed = window.confirm("Are you sure you want to delete this food log?");
    if (!isConfirmed) return;
    deleteFoodLog(id).then((data) => {
      fetchLogs();
      toast.success("🗑️ Food log deleted!");
    });
  };

  return (
    <div className="w-full max-w-3xl">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
      {/* Header & Add Button in Line */}
      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-2xl font-bold mt-6">📊 Food Consumption Log</h2>
        {/* Add Log Button */}
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + Add Food Log
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mt-4 mb-4">
        <div className="flex flex-col">
          <input
            type="date"
            className="border p-2 rounded"
            value={tempFilters.date}
            onChange={(e) => setTempFilters((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <div className="flex flex-col">
          <select
            className="border p-2 rounded"
            value={tempFilters.catId}
            onChange={(e) => setTempFilters((prev) => ({ ...prev, catId: e.target.value }))}
          >
            <option value="">All Cats</option>
            {cats.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <span className="text-gray-600">Loading food logs...</span>
        </div>
      )}

      {/* Food Log Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Cat</th>
              <th className="px-4 py-2">Food</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Calories</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.food_log_id} className="border-t">
                <td className="px-4 py-2 text-center">{formatTimestamp(log.timestamp)}</td>
                <td className="px-4 py-2 text-center">{log.cat_name}</td>
                <td className="px-4 py-2 text-center">{log.food_name}</td>
                <td className="px-4 py-2 text-center">{log.quantity} {log.unit}</td>
                <td className="px-4 py-2 text-center">{log.calories} kcal</td>
                <td className="px-4 py-2 text-center">
                  <button onClick={() => openEditModal(log)} className="text-blue-500 font-bold hover:underline">✏️ Edit</button>
                  <button onClick={() => deleteLog(log.food_log_id)} className="text-red-500 font-bold hover:underline ml-2">🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-4">
        <button disabled={!paginationLinks.previous} onClick={() => setPage(page - 1)}>⬅ Prev</button>
        <span>{page} / {totalPages}</span>
        <button disabled={!paginationLinks.next} onClick={() => setPage(page + 1)}>Next ➡</button>
      </div>

{isModalOpen && editingLog !== null && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4">{isAdding ? "Add Food Log" : "Edit Food Log"}</h2>

      {/* Select Cat */}
      <label className="block mb-2 font-semibold">Choose a Cat:</label>
      <select
        value={editingLog.catId}
        onChange={(e) => updateLog("catId", e.target.value)}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Select a cat</option>
        {cats.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Select Food */}
      <label className="block mb-2 font-semibold">Choose a Food:</label>
      <select
        value={editingLog.foodId}
        onChange={(e) => updateLog("foodId", e.target.value)}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Select a food</option>
        {foods.map((food) => (
          <option key={food.id} value={food.id}>
            {food.name} ({food.unit})
          </option>
        ))}
      </select>

      {/* Auto-filled Unit */}
      <label className="block mb-2 font-semibold">Unit:</label>
      <input
        type="text"
        value={editingLog.unit}
        readOnly
        className="border p-2 rounded w-full mb-2 bg-gray-100"
      />

      {/* Quantity Input */}
      <label className="block mb-2 font-semibold">Quantity:</label>
      <input
        type="number"
        value={editingLog.quantity}
        onChange={(e) => updateLog("quantity", e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />

      {/* Calculated Calories */}
      <p className="text-lg font-bold">Total Calories: {editingLog.calories} kcal</p>

      {/* Modal Actions */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        {isAdding && <button
          onClick={() => saveLog(true)} // Save and add another
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          Save & Add More
        </button>}
        <button
          onClick={() => saveLog(false)} // Save and close
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default FoodLogs;
