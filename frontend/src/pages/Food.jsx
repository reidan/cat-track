import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

import Modal from "../components/Modal";

import { Foods } from "../api";
const { fetchFoods, addFood, updateFood, toggleFavorite } = Foods;

function Food() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchFoods().then(setFoods).catch((error) => {
        console.error("Error fetching foods:", error);
        toast.error("Failed to fetch foods.");
      });
  }, []);

  // Search foods by name
  const handleSearch = async () => {
    const filteredFoods = await fetchFoods(searchTerm);
    setFoods(filteredFoods);
  };

  // Toggle favorite
  const handleToggleFavorite = async (foodId) => {
    try {
      const updatedFood = await toggleFavorite(foodId);
      setFoods(foods.map(food => 
        food.id === foodId ? { ...food, favorite: updatedFood.favorite } : food
      ));
      toast.success(" Food favourited!");
    } catch (e) {
      console.error("Error fetching food logs:", e);
      toast.error("Failed to favourite food.");
    }
  };

  // Open modal for adding a new food
  const openAddModal = () => {
    setIsAdding(true);
    setEditingFood({ name: "", unit: "", calories: 0 });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing food
  const openEditModal = (food) => {
    setIsAdding(false);
    setEditingFood(food);
    setIsModalOpen(true);
  };

  // Handle input change
  const changeFood = (field, value) => {
    if (!editingFood) return;
    setEditingFood({ ...editingFood, [field]: value });
  };

  // Save new or edited food
  const saveFood = async () => {
    if (!editingFood || !editingFood.name || !editingFood.unit || editingFood.calories <= 0) return;
    console.log(`saving food: ${editingFood.name}`);

    let response;
    if (isAdding) {
      addFood(editingFood).then((data) => {
        toast.success("✅ Food added!");
        fetchFoods();
      }).catch((error) => {
        console.log(`ERROR during add: ${error}`);
        toast.error("❌ Failed to add food.");
      });
    } else {
      updateFood(editingFood.id, editingFood).then((data) => {
        toast.success("✏️ Food updated!");
        fetchFoods();
      }).catch((error) => {
        console.log(`ERROR during update: ${error}`);
        toast.error("❌ Failed to update food.");
      });
    }

    setIsModalOpen(false);
    setEditingFood(null);
  };

  return (
    <div className="w-full max-w-3xl">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
      {/* Header & Add Button in Line */}
      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-2xl font-bold">🍽️ Foods</h2>
        {/* Add Food Button */}
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + Add Food
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mt-4 mb-4">
        <input 
          type="text"
          placeholder="Search foods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />
        <button 
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          🔍 Search
        </button>
      </div>

      {/* Food Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Food Name</th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Calories per Unit</th>
            <th className="px-4 py-2">Favorite</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food.id} className="border-t">
              <td className="px-4 py-2 text-center">{food.name}</td>
              <td className="px-4 py-2 text-center">{food.unit}</td>
              <td className="px-4 py-2 text-center">{food.calories} kcal</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => handleToggleFavorite(food.id)}
                  className={food.favorite ? "text-yellow-500" : "text-gray-400"}
                >
                  {food.favorite ? '★' : '☆'}
                </button>
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => openEditModal(food)}
                  className="text-blue-500 font-bold hover:underline"
                >
                  ✏️ Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {isModalOpen && editingFood !== null && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isAdding ? "Add Food" : "Edit Food"}
          actions={
            <>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveFood}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </>
          }
        >
          {/* Food Name Input */}
          <label className="block mb-2 font-semibold">Food Name:</label>
          <input
            type="text"
            value={editingFood.name}
            onChange={(e) => changeFood("name", e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          {/* Unit Input */}
          <label className="block mb-2 font-semibold">Unit (e.g., gram, can):</label>
          <input
            type="text"
            value={editingFood.unit}
            onChange={(e) => changeFood("unit", e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          {/* Calories Input (allows decimals) */}
          <label className="block mb-2 font-semibold">Calories per Unit:</label>
          <input
            type="number"
            step="0.001"
            value={editingFood.calories}
            onChange={(e) => changeFood("calories", parseFloat(e.target.value))}
            className="border p-2 rounded w-full mb-2"
          />
        </Modal>
      )}
    </div>
  );
}

export default Food;
