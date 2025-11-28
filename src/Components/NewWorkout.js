import React, { useState } from "react";
import "./NewWorkout.css";
import { FaArrowLeft, FaHome } from "react-icons/fa";

export default function NewWorkout() {
    const [workoutName, setWorkoutName] = useState("");
    const [message, setMessage] = useState("");
    const [selectedExercise, setSelectedExercise] = useState(null);

    const exercises = [
        "Squat",
        "Deadlift",
        "Bench Press",
        "Pull Ups",
        "Bent-over Row",
        "Shoulder Press"
    ];

    const handleCreateOpen = () => {
        if (!workoutName.trim()) {
            setMessage("Please enter workout name!");
            return;
        }
        setMessage(`Workout "${workoutName}" created & opened!`);
    };

    const handleSaveLater = () => {
        if (!workoutName.trim()) {
            setMessage("Please enter workout name!");
            return;
        }
        setMessage(`Workout "${workoutName}" saved for later.`);
    };

    return (
        <div className="newworkout-root">

            {/* === NAVBAR (Copied from TotalSessions) === */}
            <nav className="ts-navbar">
                <button className="nav-btn" onClick={() => window.history.back()}>
                    <FaArrowLeft /> Back
                </button>

                <div className="nav-title">New Workout</div>

                <button className="nav-btn" onClick={() => window.location.href = '/dashboard'}>
                    <FaHome /> Dashboard
                </button>
            </nav>
            {/* === END NAVBAR === */}

            {message && <p className="nw-alert">{message}</p>}

            <div className="nw-hero">
                <div className="nw-hero-left text-light">
                    <h1>Start a New Workout</h1>
                    <p>Create a new workout session by choosing exercises, sets and reps.</p>

                    <div className="nw-controls">
                        <input
                            type="text"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                            placeholder="Workout name (e.g. Upper body strength)"
                        />

                        <div className="nw-actions">
                            <button className="btn primary" onClick={handleCreateOpen}>
                                Create & Open
                            </button>

                            <button className="btn ghost" onClick={handleSaveLater}>
                                Save for later
                            </button>
                        </div>
                    </div>
                </div>

                <div className="nw-hero-right">
                    <div className="card">
                        <h3>Example template</h3>
                        <ul>
                            <li>Bench Press • 4 sets × 8 reps</li>
                            <li>Overhead Press • 3 sets × 10 reps</li>
                            <li>Incline Dumbbell Press • 3 sets × 12 reps</li>
                        </ul>
                    </div>
                </div>
            </div>

            <section className="nw-available card">
                <h3>Choose Exercises</h3>
                <p>Click an exercise to see details.</p>

                <div className="nw-exercises-grid">
                    {exercises.map((item, index) => (
                        <div
                            key={index}
                            className="card exercise-card"
                            onClick={() => setSelectedExercise(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </section>

            {selectedExercise && (
                <div className="nw-modal">
                    <div className="nw-modal-content">
                        <h2>{selectedExercise}</h2>
                        <p>This is a sample description for {selectedExercise}.  
                        You can add sets, reps, weight suggestions, etc.</p>

                        <button
                            className="btn primary"
                            onClick={() => setSelectedExercise(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
