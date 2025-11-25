import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import DashboardAdvanced from "./Components/DashboardAdvanced";
import Profile from "./Components/Profile";
import TotalSessions from "./Components/TotalSessions";
import WorkoutPage from "./WorkoutPage";
import WorkoutPlayer from "./WorkoutPlayer";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardAdvanced />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/totalsessions" element={<TotalSessions />}/>
         <Route path="/workouts" element={<WorkoutPage />} />
        <Route path="/workout/play" element={<WorkoutPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;




