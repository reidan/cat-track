import { useEffect, useState } from "react";
import Select from "react-select"; 
import { DateTime } from "luxon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

import DateInput from "../components/DateInput";
import Modal from "../components/Modal";

import { 
  Cats, 
  Foods, 
  FoodLogs as FoodLogsAPI,
  Metrics, 
} from "../api";
const { fetchCats } = Cats;
const { fetchFoods } = Foods;
const { fetchFoodLogs, addFoodLog, updateFoodLog, deleteFoodLog } = FoodLogsAPI;
const { fetchDailySummary } = Metrics;

const getTodayDate = () => DateTime.now().toFormat("yyyy-MM-dd");

function FoodLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState({ self: "", next: null, previous: null });
  
  const [cats, setCats] = useState([]);
  const [foods, setFoods] = useState([]);
  const [dailySummaries, setDailySummaries] = useState([]);

  // Applied filters (Only updates when "Apply Filters" is clicked)
  const [filters, setFilters] = useState({ catId: "", date: getTodayDate() });
  const [tempFilters, setTempFilters] = useState({ catId: "", date: getTodayDate() });

  const [selectedCatSummary, setSelectedCatSummary] = useState({
    caloriesEaten: 0,
    calorieGoal: 0,
    caloriesRemaining: 0,
    progress: 0,
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);


  const limit = 10;

  useEffect(() => {
    fetchCats().then((data) => { setCats(data) });
    fetchDailySummary(getTodayDate()).then((data) => {
      const catToDailySummary = {};
      data.map((summary) => {
        catToDailySummary[summary.cat_id] = summary;
      });
      setDailySummaries(catToDailySummary);
    });
    fetchFoods().then((data) => { 
      const sortedFoods = data.sort((a, b) => b.favorite - a.favorite);
      setFoods(sortedFoods);
    });
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const refreshDailySummaries = async () => {
    fetchDailySummary(getTodayDate()).then((data) => {
      const catToDailySummary = {};
      data.map((summary) => {
        catToDailySummary[summary.cat_id] = summary;
      });
      setDailySummaries(catToDailySummary);
    });

  }

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

  const handleDateChange = (newDate) => {
    setTempFilters((prev) => ({ ...prev, date: newDate }));
  };

  const handleApplyFilters = () => {
    setPage(1);
    setFilters(tempFilters);
  };

  const formatTimestamp = (timestamp) => {
    return DateTime.fromISO(timestamp).toFormat("MMM d @ h:mm a");
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
      food: foods.find((food) => food_id === food.id),
    });
    setIsModalOpen(true);
  };

  // Handle input change and update calories dynamically
  const updateLog = (field, value) => {
    if (!editingLog) return;

    let updatedLog = { ...editingLog, [field]: value };
    console.log(`Updating ${field}`);

    if (field === "catId") {
      console.log(`Updating Cat: ${value}`);
      updatedLog.catId = value;
      if (value) {
        const summary = dailySummaries[value];
        if (summary) {
          const caloriesEaten = summary?.total_calories || 0;
          const calorieGoal = summary?.calorie_goal || 0;
          const difference = caloriesEaten - calorieGoal;
          const progress = calorieGoal > 0 ? (caloriesEaten / calorieGoal) * 100 : 0;
          setSelectedCatSummary({
            caloriesEaten,
            calorieGoal,
            caloriesRemaining: difference,
            progress,
          });
        }
      }
    }

    if (field === "food") {
      console.log(`Updating Food: ${JSON.stringify(value, null, 2)}`);
      updatedLog.food = value;
      if (value) {
        updatedLog.foodId = value?.id;
        updatedLog.unit = value?.unit;
        updatedLog.calories = value?.calories * parseFloat(updatedLog.quantity || 0);
      }
    }

    // Recalculate calories when quantity changes
    if (field === "quantity") {
      console.log(`Updating Quantity: ${value}`);
      updatedLog.quantity = value;
      const food = updatedLog?.food;
      console.log(`Using food: ${JSON.stringify(food, null, 2)}`);
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
        handleSuccessfulSave(addMore);
        refreshDailySummaries();
        toast.success("✅ Food log added!");
      }).catch((e) => {
        console.log(`ERROR during add: ${e}`);
        toast.error("❌ Failed to add log.");
      });
    } else {
      updateFoodLog(editingLog.food_log_id, editingLog).then(
        (data) => {
          if (!addMore) {
            handleSuccessfulSave();
            refreshDailySummaries();
            toast.success("✏️ Food log updated!");
          }
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
      refreshDailySummaries();
      toast.success("🗑️ Food log deleted!");
    });
  };

  return (
    <div className="w-full max-w-3xl">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
      {/* Header & Add Button in Line */}
      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-2xl font-bold mt-6">🥘 Food Logs</h2>
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
          <DateInput value={tempFilters.date} onChange={handleDateChange} />
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
  <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    title={isAdding ? "Add Food Log" : "Edit Food Log"}
    actions={
      <>
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
      </>
    }
  >
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

      {/* Food Selection with Autocomplete */}
      <label className="block mb-2 font-semibold">Choose a Food:</label>
      <Select
        options={foods}
        getOptionLabel={(food) => `${food.favorite ? "⭐ " : ""}${food.name}`}
        getOptionValue={(food) => `${food.id}`}
        value={editingLog.food}
        onChange={(selected) => updateLog("food", selected)}
        placeholder="Search food..."
        className="mb-2"
      />

      {/* Auto-filled Unit */}
      {/*<label className="block mb-2 font-semibold">Unit:</label>
      <input
        type="text"
        value={editingLog.unit}
        readOnly
        className="border p-2 rounded w-full mb-2 bg-gray-100"
      />*/}

      {/* Quantity Input */}
      <label className="block mb-2 font-semibold">Quantity:</label>
      <input
        type="number"
        value={editingLog.quantity}
        onChange={(e) => updateLog("quantity", e.target.value)}
        className="border p-2 rounded w-half mb-2"
      />
      <span>&nbsp;&nbsp;{editingLog.unit}</span>

      {/* Calculated Calories */}
      <p className="text-lg font-bold">New Calories: {editingLog.calories} kcal</p>

      {/* Display Calories Info */}
      {isAdding && editingLog?.catId && (
        <div className="bg-gray-100 p-3 rounded-lg mb-2">
          <p className="text-lg font-bold text-blue-500">
            Eaten Today: {selectedCatSummary.caloriesEaten} kcal
          </p>
          <p className={`text-lg font-bold ${selectedCatSummary.caloriesRemaining < 0 ? "text-red-500" : "text-green-500"}`}>
            Remaining Calories: {selectedCatSummary.caloriesRemaining} kcal
          </p>
          <p className={`text-lg font-bold ${(selectedCatSummary.caloriesRemaining - editingLog.calories) < 0 ? "text-red-500" : "text-green-500"}`}>
            Remaining Calories after new food: {selectedCatSummary.caloriesRemaining - editingLog.calories} kcal
          </p>
        </div>
      )}

  </Modal>
)}

    </div>
  );
}

export default FoodLogs;
