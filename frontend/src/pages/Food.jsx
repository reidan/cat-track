import { useEffect, useState } from "react";
import axios from "axios";

function Food() {
  const [foods, setFoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    axios.get("/api/foods").then((response) => setFoods(response.data));
  }, []);

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
  const updateFood = (field, value) => {
    if (!editingFood) return;
    setEditingFood({ ...editingFood, [field]: value });
  };

  // Save new or edited food
  const saveFood = async () => {
    if (!editingFood || !editingFood.name || !editingFood.unit || editingFood.calories <= 0) return;

    let response;
    if (isAdding) {
      response = await axios.post("/api/foods", editingFood);
      setFoods([...foods, response.data]);
    } else {
      await axios.put(`/api/foods/${editingFood.id}`, editingFood);
      setFoods(foods.map((food) => (food.id === editingFood.id ? editingFood : food)));
    }

    setIsModalOpen(false);
    setEditingFood(null);
  };

  // Delete food
  const deleteFood = async (id) => {
    await axios.delete(`/api/foods/${id}`);
    setFoods(foods.filter((food) => food.id !== id));
  };

  return (
    <div className="w-full max-w-3xl">
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

      {/* Food Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Food Name</th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Calories per Unit</th>
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
                  onClick={() => openEditModal(food)}
                  className="text-blue-500 font-bold hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteFood(food.id)}
                  className="text-red-500 font-bold hover:underline ml-2"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {isModalOpen && editingFood !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">{isAdding ? "Add Food" : "Edit Food"}</h2>

            {/* Food Name Input */}
            <label className="block mb-2 font-semibold">Food Name:</label>
            <input
              type="text"
              value={editingFood.name}
              onChange={(e) => updateFood("name", e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            {/* Unit Input */}
            <label className="block mb-2 font-semibold">Unit (e.g., gram, can):</label>
            <input
              type="text"
              value={editingFood.unit}
              onChange={(e) => updateFood("unit", e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            {/* Calories Input (allows decimals) */}
            <label className="block mb-2 font-semibold">Calories per Unit:</label>
            <input
              type="number"
              step="0.001"
              value={editingFood.calories}
              onChange={(e) => updateFood("calories", parseFloat(e.target.value))}
              className="border p-2 rounded w-full mb-2"
            />

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 mt-4">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Food;
