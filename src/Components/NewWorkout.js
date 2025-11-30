import React, { useState, useEffect } from "react";
import "./NewWorkout.css";
import { FaArrowLeft, FaHome, FaTrash } from "react-icons/fa";

export default function NewWorkout() {
    const [workoutName, setWorkoutName] = useState("");
    const [message, setMessage] = useState("");
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [createdWorkout, setCreatedWorkout] = useState(null);
    const [savedWorkouts, setSavedWorkouts] = useState([]);
    const [showSavedWorkouts, setShowSavedWorkouts] = useState(false);
    const [expandedWorkout, setExpandedWorkout] = useState(null);

    const exercises = [
        "Squat",
        "Deadlift",
        "Bench Press",
        "Pull Ups",
        "Bent-over Row",
        "Shoulder Press"
    ];

    // Load saved workouts on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedWorkouts")) || [];
        setSavedWorkouts(saved);
    }, []);

    const handleCreateOpen = () => {
        if (!workoutName.trim()) {
            setMessage("Please enter workout name!");
            return;
        }
        const newWorkout = {
            id: Date.now(),
            name: workoutName,
            exercises: [],
            createdAt: new Date().toLocaleString()
        };
        setCreatedWorkout(newWorkout);
        setMessage(`Workout "${workoutName}" created & opened!`);
        setWorkoutName("");
    };

    const handleAddExercise = () => {
        if (!selectedExercise || !sets || !reps) {
            setMessage("Please fill all fields!");
            setTimeout(() => setMessage(""), 3000);
            return;
        }

        if (!createdWorkout) {
            setMessage("Please create a workout first!");
            setTimeout(() => setMessage(""), 3000);
            return;
        }

        const exerciseData = {
            id: Date.now(),
            name: selectedExercise,
            sets: parseInt(sets),
            reps: parseInt(reps),
            weight: weight ? parseInt(weight) : 0
        };

        const updated = {
            ...createdWorkout,
            exercises: [...createdWorkout.exercises, exerciseData]
        };
        
        setCreatedWorkout(updated);
        setMessage(`${selectedExercise} added to workout!`);
        setTimeout(() => setMessage(""), 3000);

        // Reset form
        setSelectedExercise(null);
        setSets("");
        setReps("");
        setWeight("");
    };

    const handleSaveLater = () => {
        if (!createdWorkout || createdWorkout.exercises.length === 0) {
            setMessage("Please add at least one exercise first!");
            setTimeout(() => setMessage(""), 3000);
            return;
        }

        const updated = [...savedWorkouts, createdWorkout];
        setSavedWorkouts(updated);
        localStorage.setItem("savedWorkouts", JSON.stringify(updated));
        setMessage(`Workout "${createdWorkout.name}" saved for later!`);
        setTimeout(() => setMessage(""), 3000);
        
        // Auto-open the saved workouts panel and expand the newly saved workout
        setShowSavedWorkouts(true);
        setExpandedWorkout(createdWorkout.id);
        setCreatedWorkout(null);
    };

    const handleDeleteExercise = (id) => {
        if (createdWorkout) {
            const updated = {
                ...createdWorkout,
                exercises: createdWorkout.exercises.filter(ex => ex.id !== id)
            };
            setCreatedWorkout(updated);
        }
    };

    const handleDeleteSavedWorkout = (id) => {
        const updated = savedWorkouts.filter(w => w.id !== id);
        setSavedWorkouts(updated);
        localStorage.setItem("savedWorkouts", JSON.stringify(updated));
        setMessage("Workout deleted!");
    };

    return (
        <div className="newworkout-root">

            {/* === NAVBAR === */}
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

            {/* MAIN CONTENT */}
            <div className="nw-container">
                {/* LEFT: CREATE WORKOUT SECTION */}
                <div className="nw-left">
                    {!createdWorkout ? (
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
                    ) : (
                        <div className="nw-workout-active">
                            <h2>Active Workout: {createdWorkout.name}</h2>
                            <p className="nw-subtitle">Created: {createdWorkout.createdAt}</p>

                            <div className="nw-exercises-section">
                                <h3>Added Exercises ({createdWorkout.exercises.length})</h3>
                                {createdWorkout.exercises.length === 0 ? (
                                    <p className="nw-empty">No exercises added yet. Add one below!</p>
                                ) : (
                                    <div className="nw-exercise-list">
                                        {createdWorkout.exercises.map((ex) => (
                                            <div key={ex.id} className="nw-exercise-item">
                                                <div className="ex-info">
                                                    <h4>{ex.name}</h4>
                                                    <p>{ex.sets} sets × {ex.reps} reps {ex.weight > 0 ? `• ${ex.weight}kg` : ""}</p>
                                                </div>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteExercise(ex.id)}
                                                >
                                                    <FaTrash /> Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="nw-controls">
                                <button className="btn ghost" onClick={() => setCreatedWorkout(null)}>
                                    Create New Workout
                                </button>
                                <button className="btn primary" onClick={handleSaveLater} disabled={createdWorkout.exercises.length === 0}>
                                    Save for Later
                                </button>
                            </div>
                        </div>
                    )}

                    {createdWorkout && (
                        <section className="nw-available card">
                            <h3>Choose Exercises</h3>
                            <p>Click an exercise to add details.</p>

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
                    )}
                </div>

                {/* RIGHT: SAVED WORKOUTS */}
                <div className="nw-right">
                    <div className="nw-saved-panel">
                        <h3>Saved Workouts ({savedWorkouts.length})</h3>
                        <button 
                            className="btn primary-small"
                            onClick={() => setShowSavedWorkouts(!showSavedWorkouts)}
                        >
                            {showSavedWorkouts ? "Hide" : "Show"} Saved
                        </button>

                        {showSavedWorkouts && (
                            <div className="nw-saved-list">
                                {savedWorkouts.length === 0 ? (
                                    <p className="nw-empty">No saved workouts yet.</p>
                                ) : (
                                    savedWorkouts.map((workout) => (
                                        <div key={workout.id}>
                                            <div 
                                                className="nw-saved-item"
                                                onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                                            >
                                                <div style={{ cursor: 'pointer', flex: 1 }}>
                                                    <h4>{workout.name}</h4>
                                                    <p className="nw-meta">{workout.exercises.length} exercises</p>
                                                    <p className="nw-date">{workout.createdAt}</p>
                                                </div>
                                                <button 
                                                    className="btn-delete-small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSavedWorkout(workout.id);
                                                    }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            
                                            {expandedWorkout === workout.id && (
                                                <div className="nw-saved-exercises">
                                                    {workout.exercises.length === 0 ? (
                                                        <p className="nw-empty">No exercises in this workout.</p>
                                                    ) : (
                                                        workout.exercises.map((ex) => (
                                                            <div key={ex.id} className="nw-saved-exercise-item">
                                                                <h5>{ex.name}</h5>
                                                                <p>{ex.sets} sets × {ex.reps} reps {ex.weight > 0 ? `• ${ex.weight}kg` : ""}</p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* EXERCISE MODAL */}
            {selectedExercise && (
                <div className="nw-modal">
                    <div className="nw-modal-content">
                        <h2>{selectedExercise}</h2>
                        <p>Add details for this exercise:</p>

                        <div className="nw-form-group">
                            <label>Sets:</label>
                            <input
                                type="number"
                                value={sets}
                                onChange={(e) => setSets(e.target.value)}
                                placeholder="e.g. 4"
                                min="1"
                            />
                        </div>

                        <div className="nw-form-group">
                            <label>Reps:</label>
                            <input
                                type="number"
                                value={reps}
                                onChange={(e) => setReps(e.target.value)}
                                placeholder="e.g. 8"
                                min="1"
                            />
                        </div>

                        <div className="nw-form-group">
                            <label>Weight (kg) - Optional:</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="e.g. 50"
                                min="0"
                            />
                        </div>

                        <div className="nw-modal-actions">
                            <button
                                className="btn primary"
                                onClick={handleAddExercise}
                            >
                                Add to Workout
                            </button>
                            <button
                                className="btn ghost"
                                onClick={() => setSelectedExercise(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
