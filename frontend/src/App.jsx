import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Cats from "./pages/Cats";
import Food from "./pages/Food";
import FoodLogs from "./pages/FoodLogs";
import BulkFoodLogs from "./pages/BulkFoodLogs";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
     <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="bg-green-700 text-white p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg md:text-2xl font-bold">🐱 Cat Tracker</h1>
            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              ☰
            </button>
          </div>

          {/* Navigation Links */}
          <div className={`md:flex ${isOpen ? "block" : "hidden"}`}>
            <NavLink to="/" className={({ isActive }) => `block p-2 ${isActive ? "bg-green-900" : ""}`}>🏠 Home</NavLink>
            <NavLink to="/cats" className={({ isActive }) => `block p-2 ${isActive ? "bg-green-900" : ""}`}>🐱 Cats</NavLink>
            <NavLink to="/foods" className={({ isActive }) => `block p-2 ${isActive ? "bg-green-900" : ""}`}>🍽️ Foods</NavLink>
            <NavLink to="/food-log" className={({ isActive }) => `block p-2 ${isActive ? "bg-green-900" : ""}`}>📊 Food Log</NavLink>
            {/*<NavLink to="/bulk" className={({ isActive }) => `block p-2 ${isActive ? "bg-green-900" : ""}`}>Bulk Upload</NavLink>*/}
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-grow p-4">

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cats" element={<Cats />} />
          <Route path="/foods" element={<Food />} />
          <Route path="/food-log" element={<FoodLogs />} />
          <Route path="/bulk" element={<BulkFoodLogs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
