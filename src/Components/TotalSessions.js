import React from "react";
import "./TotalSessions.css";

export default function TotalSessions({ count }) {
  return (
    <div className="total-sessions-card">
      <h3 className="session-title">Total Workout Sessions</h3>

      <div className="session-circle">
        <span className="session-number">{count}</span>
      </div>

      <p className="session-desc">
        Great job! Keep building your fitness streak 💪
      </p>
    </div>
  );
}
