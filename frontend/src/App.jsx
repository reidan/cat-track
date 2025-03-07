import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { useState } from "react";

import { BackendStatusProvider } from "./contexts/BackendStatusContext";
import BackendStatusBanner from "./components/BackendStatusBanner";

import Home from "./pages/Home";
import Cats from "./pages/Cats";
import Food from "./pages/Food";
import FoodLogs from "./pages/FoodLogs";
import BulkFoodLogs from "./pages/BulkFoodLogs";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
     <BackendStatusProvider>
       <Router>
        <div className="flex flex-col min-h-screen">
          {/* Navbar */}
          <nav className="bg-blue-500 text-white p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-lg md:text-2xl font-bold">🐱 Cat Tracker</h1>
              {/* Mobile Menu Button */}
              <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                ☰
              </button>
            </div>

            {/* Navigation Links */}
            <div className={`md:flex ${isOpen ? "block" : "hidden"}`}>
              <NavLink to="/" onClick={() => setIsOpen(!isOpen)} className={({ isActive }) => `block p-2 ${isActive ? "bg-black" : ""}`}>🏠 Home</NavLink>
              <NavLink to="/cats" onClick={() => setIsOpen(!isOpen)} className={({ isActive }) => `block p-2 ${isActive ? "bg-black" : ""}`}>🐱 Cats</NavLink>
              <NavLink to="/foods" onClick={() => setIsOpen(!isOpen)} className={({ isActive }) => `block p-2 ${isActive ? "bg-black" : ""}`}>🍽️ Foods</NavLink>
              <NavLink to="/food-log" onClick={() => setIsOpen(!isOpen)} className={({ isActive }) => `block p-2 ${isActive ? "bg-black" : ""}`}>🥘 Food Log</NavLink>
              {/*<NavLink to="/bulk" onClick={() => setIsOpen(!isOpen)} className={({ isActive }) => `block p-2 ${isActive ? "bg-black" : ""}`}>Bulk Upload</NavLink>*/}
            </div>
          </nav>

          {/* Page Content */}
          {/*<main className="flex-grow p-4">*/}

          {/* Define Routes */}
          {/*<Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cats" element={<Cats />} />
            <Route path="/foods" element={<Food />} />
            <Route path="/food-log" element={<FoodLogs />} />
            <Route path="/bulk" element={<BulkFoodLogs />} />
          </Routes>
        </div>*/}

        {/* Page Content */}
          <div className="flex items-center justify-center min-h-[80vh] p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cats" element={<Cats />} />
              <Route path="/foods" element={<Food />} />
              <Route path="/food-log" element={<FoodLogs />} />
              <Route path="/bulk" element={<BulkFoodLogs />} />
            </Routes>
          </div>
        </div>
      </Router>
    </BackendStatusProvider>
  );
}

export default App;
