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

function FoodLogs() {
  const [cats, setCats] = useState([]);
  const [foods, setFoods] = useState([]);
  const [foodLogs, setFoodLogs] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filters, setFilters] = useState({ cat: "", date: "" });
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    fetchCats().then((data) => { setCats(data) });
    const foods = fetchFoods().then((data) => { setFoods(data) });
    const foodLogs = fetchFoodLogs().then((data) => {
      setFoodLogs(data);
      setFilteredLogs(data); // Show all logs initially
    });
  }, []);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toLocaleDateString();
  };

  // Apply filters when button is clicked
  const applyFilters = () => {
    console.log(`Date: ${filters.date}`);
    var dateFilter = (new Date(filters.date)).toLocaleDateString();
    setFilteredLogs(
      foodLogs.filter(
        (log) =>
          (filters.cat === "" || log.catId === Number(filters.cat)) &&
          (filters.date === "" || log.timestamp.startsWith(dateFilter))
      )
    );
  };

  useEffect(() => {
    setSelectedDate(getTodayDate());
  }, []);

  // Open modal for adding a new log
  const openAddModal = () => {
    setIsAdding(true);
    setEditingLog({ catId: "", foodId: "", quantity: "", unit: "", calories: 0 });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing log
  const openEditModal = (log) => {
    setIsAdding(false);
    setEditingLog(log);
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

  // Save new or edited food log
  const saveLog = async (addMore = false) => {
    if (!editingLog || !editingLog.catId || !editingLog.foodId || editingLog.quantity <= 0) return;

    let response;
    if (isAdding) {
      addFoodLog({
        ...editingLog,
        timestamp: new Date().toISOString(),
      }).then((data) => {
        setFoodLogs([...foodLogs, data]);
      })
    } else {
      // const editedLog = {
      //   ...editingLog,
      //   timestamp: editingLog.originalTimestamp
      // };
      // delete editedLog.originalTimestamp;
      updateFoodLog(editingLog.id, editingLog).then((data) => {
        setFoodLogs(foodLogs.map((log) => (log.id === editingLog.id ? editingLog : log)));
        applyFilters()
      });
    }

    if (addMore) {
      setEditingLog({ ...editingLog, quantity: 0, calories: 0 });
    } else {
      setIsModalOpen(false);
      setEditingLog(null);
      applyFilters();
    }
  };

  // Delete food log
  const deleteLog = async (id) => {
    deleteFoodLog(id).then((data) => {
      setFoodLogs(foodLogs.filter((log) => log.id !== id));
      applyFilters();
    });
  };

  return (
    <div className="w-full max-w-3xl">
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
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <select
            value={filters.cat}
            onChange={(e) => setFilters({ ...filters, cat: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">All Cats</option>
            {cats.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={applyFilters} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Filter
        </button>
      </div>

      {/* Food Log Table */}
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
          {filteredLogs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="px-4 py-2 text-center">{log.timestamp}</td>
              <td className="px-4 py-2 text-center">{log.cat_name}</td>
              <td className="px-4 py-2 text-center">{log.food_name}</td>
              <td className="px-4 py-2 text-center">{log.quantity} {log.unit}</td>
              <td className="px-4 py-2 text-center">{log.calories} kcal</td>
              <td className="px-4 py-2 text-center">
                <button onClick={() => openEditModal(log)} className="text-blue-500 font-bold hover:underline">✏️ Edit</button>
                <button onClick={() => deleteLog(log.id)} className="text-red-500 font-bold hover:underline ml-2">🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
      <p className="text-lg font-bold">Total Calories: {editingLog.calories.toFixed(2)} kcal</p>

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
