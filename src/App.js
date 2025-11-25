import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import DashboardAdvanced from "./Components/DashboardAdvanced";
import Profile from "./Components/Profile";
import TotalSessions from "./Components/TotalSessions";
import FoodDiet from "./Components/FoodDietPage";
import SchedulePage from './Components/SchedulePage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardAdvanced />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/food-diet" element={<FoodDiet />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/totalsessions" element={<TotalSessions />} />
      </Routes>
    </Router>
  );
}

export default App;
