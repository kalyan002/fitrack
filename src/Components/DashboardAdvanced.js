import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaDumbbell,
  FaAppleAlt,
  FaCalendarAlt,
  FaUserCircle,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./DashboardAdvanced.css";
import workoutImg from "../assets/workout.jpeg";
import dietImg from "../assets/diet.jpeg";
import scheduleImg from "../assets/schedule.jpeg";
import goalImg from "../assets/goal.jpeg";


export default function DashboardAdvanced() {
  const navigate = useNavigate();

  // FIX: sidebar closed by default
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load entries
  const dietEntries = JSON.parse(localStorage.getItem("dietEntries")) || [];
  const workoutEntries = JSON.parse(localStorage.getItem("workoutEntries")) || [];
  const scheduleEntries = JSON.parse(localStorage.getItem("scheduleEntries")) || [];

  // Simple user
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Pavan",
    avatar: "",
  };

  const todayDateIso = new Date().toISOString().slice(0, 10);

  const todaysDiet = dietEntries.filter(
    (d) => (d.time || "").slice(0, 10) === todayDateIso
  );

  const totalCaloriesToday = todaysDiet.reduce(
    (s, e) => s + Number(e.calories || 0),
    0
  );

  const calorieGoal = 2200;
  const caloriesLeft = Math.max(calorieGoal - totalCaloriesToday, 0);

  const pieData = useMemo(
    () => [
      { name: "Consumed", value: totalCaloriesToday },
      { name: "Remaining", value: Math.max(calorieGoal - totalCaloriesToday, 0) },
    ],
    [totalCaloriesToday, calorieGoal]
  );

  const COLORS = ["#ff0000", "#1a1a1a"];

  const weightData = JSON.parse(localStorage.getItem("weightData")) || [
    { month: "Jan", weight: 80 },
    { month: "Feb", weight: 79 },
    { month: "Mar", weight: 78 },
    { month: "Apr", weight: 77 },
    { month: "May", weight: 76 },
    { month: "Jun", weight: 75 },
  ];

  const goal = { label: "Lose 5kg", start: 80, target: 75 };

  const currentWeight = weightData.length
    ? weightData[weightData.length - 1].weight
    : goal.start;

  const goalTotal = Math.abs(goal.start - goal.target);
  const goalReached = Math.abs(goal.start - currentWeight);
  const goalProgress =
    goalTotal === 0
      ? 100
      : Math.min(100, Math.round((goalReached / goalTotal) * 100));

  const workoutsCount = workoutEntries.length;
  const dietCount = dietEntries.length;
  const scheduleCount = scheduleEntries.length;

  return (
    <>
      <div
        className={`adv-root ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        {/* Backdrop - shown when sidebar is open; click to close */}
        {sidebarOpen && (
          <div
            className="adv-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}
        {/* ---------------------------------------------------- */}
        {/* SIDEBAR */}
        {/* ---------------------------------------------------- */}
        <aside className={`adv-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-top">
            <div className="brand" onClick={() => navigate("/")}>
              FitTrack
            </div>

            {/* CLOSE SIDEBAR BUTTON */}
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="profile-block">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="profile-avatar" />
            ) : (
              <FaUserCircle className="profile-avatar-fallback" />
            )}

            <div className="profile-meta">
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email || "No email"}</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button onClick={() => navigate("/workout/new")} className="nav-btn">
              Start Workout
            </button>

            <button onClick={() => navigate("/profile")} className="nav-btn">
              Profile
            </button>


          </nav>

          <div className="sidebar-footer">
            <small>© 2025 FitTrack</small>
          </div>
        </aside>

        {/* ---------------------------------------------------- */}
        {/* HEADER */}
        {/* ---------------------------------------------------- */}
        <header className="adv-header">
          <div className="left">
            {/* HAMBURGER BUTTON (OPEN SIDEBAR) */}
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>
              <FaBars />
            </button>

            <h2 className="page-title">Dashboard</h2>
          </div>

          <div className="right">
            <div className="summary-pill">
              <div className="pill-title">Workouts</div>
              <div className="pill-value">{workoutsCount}</div>
            </div>

            <div className="summary-pill">
              <div className="pill-title">Meals</div>
              <div className="pill-value">{dietCount}</div>
            </div>

            <div className="summary-pill">
              <div className="pill-title">Events</div>
              <div className="pill-value">{scheduleCount}</div>
            </div>

            <button className="btn" onClick={() => navigate("/workout/new")}>
              Open
            </button>

            <button
              className="nav-btn ghost"
              onClick={() => {
                const el = document.getElementById('site-footer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact
            </button>

            <button
              className="nav-btn primary"
              onClick={() => navigate("/workout/new")}
            >
              New Workout
            </button>
          </div>
        </header>

        {/* ---------------------------------------------------- */}
        {/* MAIN BODY */}
        {/* ---------------------------------------------------- */}
        <main className="adv-main">
          {/* ---------------------- */}
          {/* TOP ROW */}
          {/* ---------------------- */}
          <section className="top-row">
            {/* Calories Donut Card */}
            <div
              className="card donut-card"
              style={{
                background: "linear-gradient(135deg, #0b0a0aff, #1077b7ff)",
                color: "#e2ffe8",
              }}
            >
              <h4>Calories Today</h4>

              <div className="donut-wrap">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={48}
                      outerRadius={72}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="donut-center">
                  <div className="donut-value">{totalCaloriesToday} kcal</div>
                  <div className="donut-sub">goal {calorieGoal} kcal</div>
                </div>
              </div>

              <div className="donut-note">
                {totalCaloriesToday >= calorieGoal ? (
                  <span className="alert">Goal reached!</span>
                ) : (
                  <span>{caloriesLeft} kcal left</span>
                )}
              </div>
            </div>

            {/* Weight Chart */}
            <div
              className="card chart-card"
              style={{
                background: "linear-gradient(135deg, #130202ff, #1077b7ff)",
                color: "#fff",
              }}
            >
              <h4>Weight Progress</h4>

              <div style={{ width: "100%", height: 180 }}>
                <ResponsiveContainer>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="month" stroke="#fff" />
                    <YAxis stroke="#fff" />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#222",
                        border: "none",
                        color: "#fff",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#ff4d4d"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-caption">
                Latest: {currentWeight} kg
              </div>
            </div>
          </section>

          {/* ---------------------- */}
          {/* MIDDLE ROW */}
          {/* ---------------------- */}
          <section className="middle-row">
            {/* Workout Card */}
            <div
              className="card small-card"
              style={{
                backgroundImage: `url(${workoutImg})`,
                backgroundSize: "cover",
                color: "#fff",
                 fontWeight: "bold",
              }}
            >
              <div className="card-head">
                <FaDumbbell className="icon" />
                <div>Workout</div>
              </div>

              <div className="card-body">
                <div className="big-num">{workoutsCount}</div>
                <div className="text-light">Total sessions</div>

                <div className="actions-row">
                  <button
                    className="btn"
                    onClick={() => navigate("/totalsessions")}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>

            {/* Diet Card */}
            <div
              className="card small-card"
              style={{
                backgroundImage: `url(${dietImg})`,
                backgroundSize: "cover",
                color: "#fff",
                 fontWeight: "bold",
              }}
            >
              <div className="card-head">
                <FaAppleAlt className="icon" />
                <div>Food / Diet</div>
              </div>

              <div className="card-body">
                <div className="big-num">{dietCount}</div>
                <div className="text-light">Meals logged</div>

                <div className="actions-row">
                  <button className="btn" onClick={() => navigate("/fooddietpage")}>
                    Open
                  </button>
                </div>
              </div>
            </div>

            {/* Schedule Card */}
            <div
              className="card small-card"
              style={{
                backgroundImage: `url(${scheduleImg})`,
                backgroundSize: "cover",
                color: "#f6f0f0ff",
                fontWeight: "bold",
              }}
            >
              <div className="card-head">
                <FaCalendarAlt className="icon" />
                <div>Schedule</div>
              </div>

              <div className="card-body">
                <div className="big-num">{scheduleCount}</div>

                <div className="actions-row">
                  <button
                    className="btn"
                    onClick={() => navigate("/workout/new#schedule")}
                  >
                    Add
                  </button>

                  <button
                    className="btn"
                    onClick={() => navigate("/schedulepage")}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>

            {/* Goal Card */}
            <div
              className="card goal-card"
              style={{
                backgroundImage: `url(${goalImg})`,
                backgroundSize: "cover",
                color: "#fff",
                 fontWeight: "bold", 
              }}
            >
              <div className="goal-head">
                <div>
                  <div className="muted">Goal</div>
                  <div className="goal-title">{goal.label}</div>
                </div>

              </div>

              <div className="progress-wrap">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${goalProgress}%`,
                      backgroundColor: "#00ff85",
                    }}
                  />
                </div>

                <div className="progress-meta">
                  <div>{goalProgress}%</div>
                  <div className="muted">progress</div>
                </div>
              </div>

              <div className="goal-caption">Current weight: {currentWeight} kg</div>
            </div>
          </section>

          {/* ---------------------- */}
          {/* BOTTOM ROW */}
          {/* ---------------------- */}
          <section className="bottom-row">
            {/* Recent Activities */}
            <div className="card list-card">
              <h4>Recent Activities</h4>

              {workoutEntries.length === 0 ? (
                <p className="muted">No recent activities</p>
              ) : (
                <ul className="list">
                  {workoutEntries.slice(0, 6).map((w) => (
                    <li key={w.id || Math.random()}>
                      <div className="li-left">
                        <div className="li-title">{w.exercise || "Exercise"}</div>
                        <div className="muted small">
                          {w.reps ? `Reps: ${w.reps}` : ""}{" "}
                          {w.weight ? `• ${w.weight}kg` : ""}
                        </div>
                      </div>

                      <div className="li-right muted">
                        {w.time ? new Date(w.time).toLocaleString() : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Schedule List */}
            <div className="card list-card">
              <h4>Upcoming Schedule</h4>

              {scheduleEntries.length === 0 ? (
                <p className="muted">No events scheduled</p>
              ) : (
                <ul className="list">
                  {scheduleEntries.slice(0, 6).map((s) => (
                    <li key={s.id || Math.random()}>
                      <div className="li-left">
                        <div className="li-title">{s.title}</div>
                        <div className="muted small">
                          {s.date} {s.time ? `• ${s.time}` : ""}
                        </div>
                      </div>

                      <div className="li-right">
                        <button
                          className="btn ghost"
                          onClick={() => navigate("/schedule")}
                        >
                          Open
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </main>
      
      </div>
    
    </>
  );
}

