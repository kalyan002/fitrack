import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import DashboardAdvanced from "./Components/DashboardAdvanced";
import Profile from "./Components/Profile";
import TotalSessions from "./Components/TotalSessions";
import FoodDietPage from "./Components/FoodDietPage";
import SchedulePage from "./Components/SchedulePage";
import WorkoutPlayer from "./Components/WorkoutPlayer";

function App() {
  return (
   <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardAdvanced />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/totalsessions" element={<TotalSessions />}/>
         <Route path="/fooddietpage" element={<FoodDietPage />}/>
          <Route path="/schedulepage" element={<SchedulePage />}/><Route path="/workoutplayer" element={<WorkoutPlayer />} />
      </Routes>
   
  );
}

export default App;




