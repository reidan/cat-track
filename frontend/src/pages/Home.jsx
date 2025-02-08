import { useEffect, useState } from "react";
import { fetchCats, fetchFoodLogs, fetchWeeklyFoodLogs } from "../api";

import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function Home() {
  const [cats, setCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [foodLogs, setFoodLogs] = useState([]);

  useEffect(() => {
    const cats = fetchCats();
    setCats(cats);
    if (cats.length > 0) {
      setSelectedCat(cats[0].id);
    }
    const foodLogs = fetchFoodLogs();
    setFoodLogs(foodLogs);
  }, []);

  useEffect(() => {
    if (selectedCat) {
      const weeklyFoodLogs = fetchWeeklyFoodLogs(selectedCat);
      const formattedData = Object.entries(weeklyFoodLogs).map(([date, values]) => ({
        date,
        caloriesEaten: values.calories.toFixed(0),
        calorieGoal: values.goal.toFixed(0),
      }));
      setWeeklyData(formattedData);
    }
  }, [selectedCat]);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toLocaleDateString();
  };

  // Calculate daily calorie intake per cat
  const getCatCalories = (catId) => {
    const todayLogs = foodLogs.filter(
      (log) => log.catId === catId && (new Date(log.timestamp)).toLocaleDateString() === getTodayDate()
    );

    return todayLogs.reduce((total, log) => total + log.calories, 0);
  };

  return (
    <div className="w-full max-w-3xl text-center">
      <h2 className="text-3xl font-bold mt-6">Welcome to the Cat Tracker! 🐱</h2>
      <p className="mt-4 text-lg">Monitor your cats' daily food intake.</p>
      <p className="mt-4 text-lg">API URL: {`${__API_URL__}`</p>

      {/* Daily Calorie Summary */}
      <h3 className="text-2xl font-bold mt-6">📊 Daily Food Summary ({getTodayDate()})</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Cat</th>
            <th className="px-4 py-2">Calories Eaten</th>
            <th className="px-4 py-2">Daily Goal</th>
            <th className="px-4 py-2">Difference</th>
            <th className="px-4 py-2">Progress</th>
          </tr>
        </thead>
        <tbody>
          {cats.map((cat) => {
            const caloriesEaten = getCatCalories(cat.id);
            const calorieGoal = cat.calorieGoal || 0;
            const difference = caloriesEaten - calorieGoal;
            const progress = calorieGoal > 0 ? (caloriesEaten / calorieGoal) * 100 : 0;

            return (
              <tr key={cat.id} className="border-t">
                <td className="px-4 py-2 text-center"><img
                    src={cat.photo}
                    alt={cat.name}
                    className="w-16 h-16 object-cover rounded-full border"
                  />{cat.name}</td>
                <td className="px-4 py-2 text-center">{caloriesEaten.toFixed(0)} kcal</td>
                <td className="px-4 py-2 text-center">{calorieGoal.toFixed(0)} kcal</td>
                <td
                  className={`px-4 py-2 text-center font-bold ${
                    difference < -10 ? "text-red-500" : difference > 10 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {difference.toFixed(2)} kcal
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="w-32 bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        progress > 105 ? "bg-red-500" : progress < 90 ? "bg-blue-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="w-full max-w-3xl text-center">
        <h2 className="text-3xl font-bold mt-6">📊 Weekly Food Summary</h2>

        {/* Cat Selector */}
        <label className="font-bold block mt-4">Select a Cat:</label>
        <select
          className="border p-2 rounded w-full max-w-xs mb-4"
          value={selectedCat || ""}
          onChange={(e) => setSelectedCat(Number(e.target.value))}
        >
          {cats.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={weeklyData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="caloriesEaten" fill="#4A90E2" name="Calories Eaten" />

            {/*<ReferenceLine y={cats.filter((c) => c.id === selectedCat)[0]?.calorieGoal} label="Calorie Goal" stroke="black" strokeDasharray="3 3" />*/}
            <Line type="monotone" dataKey="calorieGoal" stroke="#000000" name="Calorie Goal" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Home;
