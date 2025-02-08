import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Cats from "./pages/Cats";
import Food from "./pages/Food";
import FoodLogs from "./pages/FoodLogs";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-4">🐱 Cat Tracker</h1>

        {/* Navigation Menu */}
        <nav className="mb-6 space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-bold ${
                isActive ? "bg-blue-500 text-white" : "text-blue-500 hover:bg-blue-100"
              }`
            }
          >
            🏠 Home
          </NavLink>

          <NavLink
            to="/cats"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-bold ${
                isActive ? "bg-green-500 text-white" : "text-green-500 hover:bg-green-100"
              }`
            }
          >
            🐱 Cats
          </NavLink>

          <NavLink
            to="/foods"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-bold ${
                isActive ? "bg-orange-500 text-white" : "text-orange-500 hover:bg-orange-100"
              }`
            }
          >
            🍽️ Foods
          </NavLink>

          <NavLink
            to="/food-log"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-bold ${
                isActive ? "bg-red-500 text-white" : "text-red-500 hover:bg-red-100"
              }`
            }
          >
            📊 Food Log
          </NavLink>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cats" element={<Cats />} />
          <Route path="/foods" element={<Food />} />
          <Route path="/food-log" element={<FoodLogs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
