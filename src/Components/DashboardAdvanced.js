import React, { useMemo, useState, useEffect } from "react";
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

export default function DashboardAdvanced() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // load entries from localStorage
  const dietEntries = JSON.parse(localStorage.getItem("dietEntries")) || [];
  const workoutEntries = JSON.parse(localStorage.getItem("workoutEntries")) || [];
  const scheduleEntries = JSON.parse(localStorage.getItem("scheduleEntries")) || [];

  // simple user
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Pavan", avatar: "" };

  // compute today's calories (sum of entries with today date)
  const todayDateIso = new Date().toISOString().slice(0, 10);
  const todaysDiet = dietEntries.filter((d) => (d.time || "").slice(0, 10) === todayDateIso);
  const totalCaloriesToday = todaysDiet.reduce((s, e) => s + Number(e.calories || 0), 0);

  // calorie goal (configurable)
  const calorieGoal = 2200;
  const caloriesLeft = Math.max(calorieGoal - totalCaloriesToday, 0);

  // data for donut chart: [consumed, remaining]
  const pieData = useMemo(
    () => [
      { name: "Consumed", value: totalCaloriesToday },
      { name: "Remaining", value: Math.max(calorieGoal - totalCaloriesToday, 0) },
    ],
    [totalCaloriesToday, calorieGoal]
  );

  const COLORS = ["#0b84ff", "#e6eefc"];

  // sample weight data (combine local weight data if you have it, fallback to demo)
  const weightData = JSON.parse(localStorage.getItem("weightData")) || [
    { month: "Jan", weight: 80 },
    { month: "Feb", weight: 79 },
    { month: "Mar", weight: 78 },
    { month: "Apr", weight: 77 },
    { month: "May", weight: 76 },
    { month: "Jun", weight: 75 },
  ];

  // goal progress example: lose 5kg from baseline 80 -> target 75
  const goal = { label: "Lose 5kg", start: 80, target: 75 };
  // compute progress as % towards target (start -> target)
  const currentWeight = weightData.length ? weightData[weightData.length - 1].weight : goal.start;
  const goalTotal = Math.abs(goal.start - goal.target);
  const goalReached = Math.abs(goal.start - currentWeight);
  const goalProgress = goalTotal === 0 ? 100 : Math.min(100, Math.round((goalReached / goalTotal) * 100));

  // reactive counts for header/summary
  const workoutsCount = workoutEntries.length;
  const dietCount = dietEntries.length;
  const scheduleCount = scheduleEntries.length;

  // refresh when localStorage changes from other tabs (optional)
  useEffect(() => {
    const onStorage = () => {
      // force update by reading localStorage and setting nothing; for simplicity use location.reload? Instead we'll no-op because we already re-read on render
      // but to make the UI reactive across tabs we'd keep a state; for now rely on renders when navigated back/added.
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className={`adv-root ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Sliding Sidebar */}
      <aside className="adv-sidebar">
        <div className="sidebar-top">
          <div className="brand" onClick={() => navigate("/")}>FitTrack</div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
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
          <button onClick={() => navigate("/dashboard")} className="nav-btn">Overview</button>
          <button onClick={() => navigate("/workout/new")} className="nav-btn">Start Workout</button>
          <button onClick={() => navigate("/profile")} className="nav-btn">Profile</button>
          <button onClick={() => navigate("/settings")} className="nav-btn">Settings</button>
        </nav>

        <div className="sidebar-footer">
          <small>© 2025 FitTrack</small>
        </div>
      </aside>

      {/* Top navbar */}
      <header className="adv-header">
        <div className="left">
          <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
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
        </div>
      </header>

      <main className="adv-main">
        {/* Top area: calorie donut + weight line */}
        <section className="top-row">
          <div className="card donut-card">
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
                    paddingAngle={2}
                    isAnimationActive={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                <span className="alert">You've reached or exceeded your goal</span>
              ) : (
                <span>{caloriesLeft} kcal left</span>
              )}
            </div>
          </div>

          <div className="card chart-card">
            <h4>Weight Progress</h4>
            <div style={{ width: "100%", height: 180 }}>
              <ResponsiveContainer>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#0b84ff" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-caption">Latest: {currentWeight} kg</div>
          </div>
        </section>

        {/* Middle row: 3 cards and goal progress */}
        <section className="middle-row">
          <div className="card small-card">
            <div className="card-head"><FaDumbbell className="icon" /><div>Workout</div></div>
            <div className="card-body">
              <div
                className="big-num"
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                onClick={() => navigate("/totalsessions")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate("/totalsessions");
                }}
                aria-label={`Open total sessions (${workoutsCount})`}
              >
                {workoutsCount}
              </div>
              <div className="muted">Total sessions</div>
              <div className="actions-row">
                <button className="btn" onClick={() => navigate("/workout/new")}>Start</button>
                <button className="btn ghost" onClick={() => navigate("/workout/new#workout")}>Open</button>
              </div>
            </div>
          </div>

          <div className="card small-card">
            <div className="card-head"><FaAppleAlt className="icon" /><div>Food / Diet</div></div>
            <div className="card-body">
              <div className="big-num">{dietCount}</div>
              <div className="muted">Meals logged</div>
              <div className="actions-row">
                <button className="btn" onClick={() => navigate("/workout/new#diet")}>Log</button>
                <button className="btn ghost" onClick={() => navigate("/workout/new")}>Open</button>
              </div>
            </div>
          </div>

          <div className="card small-card">
            <div className="card-head"><FaCalendarAlt className="icon" /><div>Schedule</div></div>
            <div className="card-body">
              <div className="big-num">{scheduleCount}</div>
              <div className="muted">Upcoming events</div>
              <div className="actions-row">
                <button className="btn" onClick={() => navigate("/workout/new#schedule")}>Add</button>
                <button className="btn ghost" onClick={() => navigate("/workout/new")}>Open</button>
              </div>
            </div>
          </div>

          {/* goal progress */}
          <div className="card goal-card">
            <div className="goal-head">
              <div>
                <div className="muted">Goal</div>
                <div className="goal-title">{goal.label}</div>
              </div>
              <div className="goal-numbers">
                <div className="muted small">Start</div>
                <div>{goal.start}kg</div>
                <div className="muted small">Target</div>
                <div>{goal.target}kg</div>
              </div>
            </div>

            <div className="progress-wrap">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${goalProgress}%` }} />
              </div>
              <div className="progress-meta">
                <div>{goalProgress}%</div>
                <div className="muted">progress</div>
              </div>
            </div>
            <div className="goal-caption">Current weight: {currentWeight} kg</div>
          </div>
        </section>

        {/* Bottom row: Recent activities & schedule list */}
        <section className="bottom-row">
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
                      <div className="muted small">{w.reps ? `Reps: ${w.reps}` : ""} {w.weight ? `• ${w.weight}kg` : ""}</div>
                    </div>
                    <div className="li-right muted">{w.time ? new Date(w.time).toLocaleString() : ""}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
                      <div className="muted small">{s.date} {s.time ? `• ${s.time}` : ""}</div>
                    </div>
                    <div className="li-right">
                      <button className="btn ghost" onClick={() => navigate("/workout/new#schedule")}>Open</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
