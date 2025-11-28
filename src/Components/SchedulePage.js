import React, { useEffect, useMemo, useState } from 'react';
import './Schedule.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaArrowLeft, FaHome } from 'react-icons/fa';


function SchedulePage() {
    const [view, setView] = useState('Day');
    const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('scheduleEntries')) || []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '', date: '', time: '', type: 'Workout', notes: '',
        repeat: 'none', exercise: '', sets: '', reps: '', weight: ''
    });

    const exercisePresets = ['Squat','Bench Press','Deadlift','Overhead Press','Barbell Row','Pull-up','Dip','Leg Press','Running','Rowing'];

    useEffect(() => { localStorage.setItem('scheduleEntries', JSON.stringify(items)); }, [items]);

    const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

    function addItem() {
        if (!form.title || !form.date) { alert('Please provide title and date'); return; }
        setItems(s => [{ id: `s-${Date.now()}`, ...form, repeat: form.repeat || 'none' }, ...s]);
        setForm({ title: '', date: '', time: '', type: 'Workout', notes: '', repeat: 'none', exercise: '', sets: '', reps: '', weight: '' });
        setShowForm(false);
    }

    function removeItem(id) {
        setItems(s => s.filter(i => i.id !== id));
    }

    // recurrence logic
    function eventOccursOn(event, isoDate) {
        const start = (event.date || '').slice(0, 10);
        if (!start) return false;
        const d = new Date(isoDate);
        const startDate = new Date(start);
        if (startDate > d) return false;

        const repeat = event.repeat || 'none';
        if (repeat === 'none') return start === isoDate;
        if (repeat === 'daily') return startDate <= d;
        if (repeat === 'weekly') return startDate.getDay() === d.getDay();
        if (repeat === 'monthly') return startDate.getDate() === d.getDate();
        return false;
    }

    function formatExerciseDetails(ev) {
        const parts = [];
        if (ev.exercise) parts.push(ev.exercise);
        if (ev.sets) parts.push(`${ev.sets}x${ev.reps || ''}`.replace(/x$/, ''));
        if (ev.weight) parts.push(`@ ${ev.weight}kg`);
        return parts.join(' • ');
    }

    function exportSchedule() {
        const el = document.querySelector('.sc-main .sc-left');
        if (!el) return alert('Could not find schedule element');

        html2canvas(el, { scale: 2 }).then(canvas => {
            const img = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const w = pdf.internal.pageSize.getWidth();
            const h = (canvas.height * w) / canvas.width;
            pdf.addImage(img, 'PNG', 0, 0, w, h);
            pdf.save(`fitrack-schedule-${view.toLowerCase()}.pdf`);
        });
    }

    // FILTERS
    const dayItems = items.filter(i => eventOccursOn(i, today))
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    // WEEK
    const weekStart = (() => {
        const d = new Date();
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const start = new Date(d.setDate(diff));
        return start.toISOString().slice(0, 10);
    })();

    const monthItems = items;

    // 🔥 NAV BAR COUNTS
    const totalSessions = items.length;
    const totalWorkouts = items.filter(i => i.type === "Workout").length;
    const totalClasses = items.filter(i => i.type === "Class").length;
    const totalRest = items.filter(i => i.type === "Rest").length;

    return (
        <div className="sc-page">

           
                       {/* === NAVBAR (Copied from TotalSessions) === */}
                       <nav className="ts-navbar">
                           <button className="nav-btn" onClick={() => window.history.back()}>
                               <FaArrowLeft /> Back
                           </button>
           
                           <div className="nav-title">Schedule</div>
           
                           <button className="nav-btn" onClick={() => window.location.href = '/dashboard'}>
                               <FaHome /> Dashboard
                           </button>
                       </nav>
                       {/* === END NAVBAR === */}

            {/* HERO */}
            <header className="sc-hero">
                <div>
                    <h1>Training Schedule & Plans</h1>
                    <p className="muted">Create, view and export your training schedule — day, week, or month.</p>
                </div>

                <div className="sc-controls">
                    <button className={view === 'Day' ? 'active' : ''} onClick={() => setView('Day')}>Day</button>
                    <button className={view === 'Week' ? 'active' : ''} onClick={() => setView('Week')}>Week</button>
                    <button className={view === 'Month' ? 'active' : ''} onClick={() => setView('Month')}>Month</button>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="sc-main">
                <section className="sc-left">
                    <div className="sc-actions">
                        <button className="btn primary" onClick={() => setShowForm(true)}>Add Event</button>
                        <button className="btn outline" onClick={exportSchedule}>Export PDF</button>
                    </div>

                    {/* ================= DAY VIEW ================= */}
                    {view === 'Day' && (
                        <div className="sc-card">
                            <h3>Day schedule — {today}</h3>
                            {dayItems.length === 0 ? (
                                <div className="muted">No events</div>
                            ) : (
                                <ul className="sc-list">
                                    {dayItems.map(it => (
                                        <li key={it.id} className="sc-row">
                                            <div>
                                                <strong>{it.title}</strong>
                                                <div className="muted">
                                                    {it.type} • {it.time || 'Anytime'}
                                                    {it.repeat !== 'none' &&
                                                        <span className="repeat-pill">{it.repeat}</span>}
                                                </div>

                                                {it.type === 'Workout' && (
                                                    <div className="exercise-meta">{formatExerciseDetails(it)}</div>
                                                )}
                                            </div>

                                            <div className="sc-row-actions">
                                                <button className="btn ghost"
                                                    onClick={() => navigator.clipboard?.writeText(JSON.stringify(it))}
                                                >Copy</button>

                                                <button className="btn ghost"
                                                    onClick={() => removeItem(it.id)}
                                                >Remove</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* ================= WEEK VIEW ================= */}
                    {view === 'Week' && (
                        <div className="sc-card">
                            <h3>Week schedule</h3>

                            <table className="sc-table">
                                <thead>
                                    <tr><th>Day</th><th>Events</th></tr>
                                </thead>
                                <tbody>
                                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, idx) => {
                                        const s = new Date(weekStart);
                                        s.setDate(new Date(weekStart).getDate() + idx);
                                        const iso = s.toISOString().slice(0, 10);

                                        let list = items.filter(x => eventOccursOn(x, iso))
                                            .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

                                        return (
                                            <tr key={d}>
                                                <td>{d} <div className="muted small">{iso}</div></td>
                                                <td>
                                                    {list.length === 0 ? (
                                                        <span className="muted">No events</span>
                                                    ) : (
                                                        <ul className="sc-list-small">
                                                            {list.map(it => (
                                                                <li key={it.id}>
                                                                    <strong>{it.title}</strong>
                                                                    <span className="muted">
                                                                        {it.type}
                                                                        {it.time ? ` • ${it.time}` : ''}
                                                                        {it.repeat !== 'none' && (
                                                                            <span className="repeat-pill">{it.repeat}</span>
                                                                        )}
                                                                        {it.type === 'Workout' &&
                                                                            <div className="exercise-meta small muted">
                                                                                {formatExerciseDetails(it)}
                                                                            </div>}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ================= MONTH VIEW ================= */}
                    {view === 'Month' && (
                        <div className="sc-card">
                            <h3>Month overview</h3>

                            {(() => {
                                const now = new Date();
                                const year = now.getFullYear();
                                const month = now.getMonth();
                                const days = new Date(year, month + 1, 0).getDate();
                                const occ = [];

                                for (let d = 1; d <= days; d++) {
                                    const iso = new Date(year, month, d).toISOString().slice(0, 10);
                                    items.forEach(it => {
                                        if (eventOccursOn(it, iso)) occ.push({ ...it, occDate: iso });
                                    });
                                }

                                occ.sort((a, b) => new Date(a.occDate) - new Date(b.occDate));

                                return (
                                    <>
                                        <div className="muted" style={{ marginBottom: 8 }}>
                                            This month: {occ.length} scheduled occurrences
                                        </div>

                                        {occ.length === 0 ? (
                                            <div className="muted">No events</div>
                                        ) : (
                                            <table className="sc-table">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Title</th>
                                                        <th>Type</th>
                                                        <th>Time</th>
                                                        <th>Repeat</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {occ.map((it, idx) => (
                                                        <tr key={idx}>
                                                            <td>{it.occDate}</td>
                                                            <td>
                                                                {it.title}
                                                                {it.type === 'Workout' && (
                                                                    <div className="exercise-meta small muted">
                                                                        {formatExerciseDetails(it)}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td>{it.type}</td>
                                                            <td>{it.time || '-'}</td>
                                                            <td>
                                                                <span className="repeat-pill">{it.repeat}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </section>

                {/* ================= RIGHT SIDEBAR ================= */}
                <aside className="sc-right">
                    <div className="sc-card">
                        <h4>Training Plans</h4>
                        <div className="plan-list">
                            <div className="plan">
                                <div className="plan-head">Strength Focus</div>
                                <div className="muted small">4-week hypertrophy cycle, 4 days/week</div>
                                <ol>
                                    <li>Day 1: Squat + Assistance</li>
                                    <li>Day 2: Bench + Press</li>
                                    <li>Day 3: Pull + Hinge</li>
                                    <li>Day 4: Accessory & Conditioning</li>
                                </ol>
                            </div>

                            <div className="plan">
                                <div className="plan-head">Cardio Endurance</div>
                                <div className="muted small">8-week interval progression</div>
                                <ol>
                                    <li>Intervals</li>
                                    <li>Tempo</li>
                                    <li>Long run</li>
                                    <li>Recovery</li>
                                </ol>
                            </div>

                            <div className="plan">
                                <div className="plan-head">Active Recovery</div>
                                <div className="muted small">Mobility + light movement</div>
                                <ol>
                                    <li>Yoga / Mobility</li>
                                    <li>Light Swim / Walk</li>
                                    <li>Stretching & Breathing</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="sc-card quick-add">
                        <h4>Quick Add Event</h4>

                        <input placeholder="Title"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />

                        <input type="date"
                            value={form.date}
                            onChange={e => setForm({ ...form, date: e.target.value })}
                        />

                        <input type="time"
                            value={form.time}
                            onChange={e => setForm({ ...form, time: e.target.value })}
                        />

                        <select value={form.type}
                            onChange={e => setForm({ ...form, type: e.target.value })}
                        >
                            <option>Workout</option>
                            <option>Class</option>
                            <option>Rest</option>
                        </select>

                        {form.type === 'Workout' && (
                            <>
                                <select
                                    value={form.exercise}
                                    onChange={e => setForm({ ...form, exercise: e.target.value })}
                                >
                                    <option value="">Choose exercise (optional)</option>
                                    {exercisePresets.map(p => <option key={p}>{p}</option>)}
                                </select>

                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input placeholder="Sets" type="number"
                                        value={form.sets}
                                        onChange={e => setForm({ ...form, sets: e.target.value })}
                                    />
                                    <input placeholder="Reps" type="number"
                                        value={form.reps}
                                        onChange={e => setForm({ ...form, reps: e.target.value })}
                                    />
                                    <input placeholder="Weight (kg)" type="number"
                                        value={form.weight}
                                        onChange={e => setForm({ ...form, weight: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        <select
                            value={form.repeat}
                            onChange={e => setForm({ ...form, repeat: e.target.value })}
                        >
                            <option value="none">No repeat</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>

                        <textarea placeholder="Notes"
                            value={form.notes}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                        />

                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button className="btn outline"
                                onClick={() => setForm({ title: '', date: '', time: '', type: 'Workout', notes: '', repeat: 'none' })}
                            >Clear</button>

                            <button className="btn primary" onClick={addItem}>
                                Add
                            </button>
                        </div>
                    </div>
                </aside>
            </main>

            {/* MODAL */}
            {showForm && (
                <div className="sc-modal">
                    <div className="sc-modal-backdrop" onClick={() => setShowForm(false)} />

                    <div className="sc-modal-panel">
                        <h3>New Schedule Event</h3>

                        <label>Title
                            <input value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                            />
                        </label>

                        <label>Date
                            <input type="date"
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                            />
                        </label>

                        <label>Time
                            <input type="time"
                                value={form.time}
                                onChange={e => setForm({ ...form, time: e.target.value })}
                            />
                        </label>

                        <label>Type
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                            >
                                <option>Workout</option>
                                <option>Class</option>
                                <option>Rest</option>
                            </select>
                        </label>

                        {form.type === 'Workout' && (
                            <>
                                <label>Exercise
                                    <select
                                        value={form.exercise}
                                        onChange={e => setForm({ ...form, exercise: e.target.value })}
                                    >
                                        <option value="">Choose exercise (optional)</option>
                                        {exercisePresets.map(p => <option key={p}>{p}</option>)}
                                    </select>
                                </label>

                                <div style={{ display: 'flex', gap: 8 }}>
                                    <label style={{ flex: 1 }}>
                                        Sets
                                        <input type="number"
                                            value={form.sets}
                                            onChange={e => setForm({ ...form, sets: e.target.value })}
                                        />
                                    </label>

                                    <label style={{ flex: 1 }}>
                                        Reps
                                        <input type="number"
                                            value={form.reps}
                                            onChange={e => setForm({ ...form, reps: e.target.value })}
                                        />
                                    </label>

                                    <label style={{ flex: 1 }}>
                                        Weight (kg)
                                        <input type="number"
                                            value={form.weight}
                                            onChange={e => setForm({ ...form, weight: e.target.value })}
                                        />
                                    </label>
                                </div>
                            </>
                        )}

                        <label>Repeat
                            <select
                                value={form.repeat}
                                onChange={e => setForm({ ...form, repeat: e.target.value })}
                            >
                                <option value="none">No repeat</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </label>

                        <label>Notes
                            <textarea
                                value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                            />
                        </label>

                        <div className="modal-actions">
                            <button className="btn outline" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="btn primary" onClick={addItem}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SchedulePage;
