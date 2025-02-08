import { useEffect, useState } from "react";
import { fetchCats, addCat, updateCat, deleteCat } from "../api";

function Cats() {
  const [cats, setCats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  useEffect(() => {
    const cats = fetchCats();
    setCats(cats);
  }, []);

  const openModal = (cat = null) => {
    setEditingCat(cat || { name: "", birthday: "", calorieGoal: 0, photo: null });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setEditingCat({ ...editingCat, photo: file });
  };

  const saveCat = async () => {
    const formData = new FormData();
    formData.append("name", editingCat.name);
    formData.append("birthday", editingCat.birthday);
    formData.append("calorieGoal", parseInt(editingCat.calorieGoal, 10) || 0);
    if (editingCat.photo instanceof File) {
      formData.append("photo", editingCat.photo);
    }

    let response;
    if (editingCat.id) {
      response = updateCat(editingCat.id, formData);
      // axios.put(`/api/cats/${editingCat.id}`, formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      setCats(cats.map((cat) => (cat.id === editingCat.id ? response.data : cat)));
    } else {
      response = addCat(formData);
      // axios.post("/api/cats", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      setCats([...cats, response.data]);
    }

    setIsModalOpen(false);
    setEditingCat(null);
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-2xl font-bold">🐱 Cat List</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + Add Cat
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Photo</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Birthday</th>
            <th className="px-4 py-2">Daily Calorie Goal</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cats.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="px-4 py-2 text-center w-16">
                {cat.photo && (
                  <img
                    src={cat.photo}
                    alt={cat.name}
                    className="w-16 h-16 object-cover rounded-full border"
                  />
                )}
              </td>
              <td className="px-4 py-2 text-center">{cat.name}</td>
              <td className="px-4 py-2 text-center">🎂 {cat.birthday}</td>
              <td className="px-4 py-2 text-center">{cat.calorieGoal} kcal</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => openModal(cat)}
                  className="text-blue-500 font-bold hover:underline"
                >
                  ✏️ Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cat Modal */}
      {isModalOpen && editingCat !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">{editingCat.id ? "Edit Cat" : "Add Cat"}</h2>
            <input
              type="text"
              placeholder="Cat Name"
              value={editingCat.name}
              onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="date"
              value={editingCat.birthday}
              onChange={(e) => setEditingCat({ ...editingCat, birthday: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border p-2 rounded w-full mb-2"
            />
            {editingCat.photo && (
              <img
                src={editingCat.photo instanceof File ? URL.createObjectURL(editingCat.photo) : editingCat.photo}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
              />
            )}
            <input
              type="number"
              placeholder="Daily Calorie Goal (kcal)"
              value={editingCat.calorieGoal}
              onChange={(e) =>
                setEditingCat({ ...editingCat, calorieGoal: parseInt(e.target.value, 10) || 0 })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveCat}
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

export default Cats;
