// WorkoutPlayer.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStop, FaPlay, FaArrowLeft } from "react-icons/fa";
import "./WorkoutPlayer.css";

export default function WorkoutPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    // first try to get from localStorage (set by startWorkout)
    const stored = JSON.parse(localStorage.getItem("selectedWorkout") || "null");
    if (stored && stored.id === id) {
      setWorkout(stored);
      setSecondsLeft((stored.duration || 0) * 60);
      return;
    }

    // fallback: attempt to find workout in a static list (same shape as WorkoutPage)
    const workouts = JSON.parse(localStorage.getItem("workoutsList") || "null");
    if (workouts && Array.isArray(workouts)) {
      const w = workouts.find((x) => x.id === id);
      if (w) {
        setWorkout(w);
        setSecondsLeft((w.duration || 0) * 60);
        return;
      }
    }

    // as last resort, try to fetch details from selectedWorkout even if ids mismatch
    if (stored) {
      setWorkout(stored);
      setSecondsLeft((stored.duration || 0) * 60);
      return;
    }

    // nothing found -> show message
    setWorkout(null);
  }, [id]);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, secondsLeft]);

  if (workout === null) {
    return (
      <div className="wp-player-root">
        <div className="wp-player-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <h2>No workout found</h2>
          <p>We couldn't find the workout. Please pick one from the workouts list.</p>
          <button onClick={() => navigate("/workouts")}>Open Workouts</button>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="wp-player-root">
      <div className="wp-player-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="player-card">
          <img src={workout.image} alt={workout.name} className="player-img" />
          <div className="player-meta">
            <h2>{workout.name}</h2>
            <p className="muted">{workout.description}</p>
            <div className="player-stats">
              <div>Duration: {workout.duration} min</div>
              <div>Difficulty: {workout.difficulty}</div>
            </div>

            <div className="player-timer">
              <div className="time-display">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>

              <div className="player-controls">
                {!running ? (
                  <button
                    className="btn-start"
                    onClick={() => {
                      setRunning(true);
                    }}
                  >
                    <FaPlay /> Start
                  </button>
                ) : (
                  <button
                    className="btn-stop"
                    onClick={() => {
                      setRunning(false);
                    }}
                  >
                    <FaStop /> Stop
                  </button>
                )}

                <button
                  className="btn-end"
                  onClick={() => {
                    setRunning(false);
                    // optional: clear selected workout
                    // localStorage.removeItem("selectedWorkout");
                    navigate("/workouts");
                  }}
                >
                  End
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
