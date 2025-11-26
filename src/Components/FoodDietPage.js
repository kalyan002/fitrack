import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FoodDiet.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

 function FoodDietPage() {
    const [range, setRange] = useState('Day');
    const [mode, setMode] = useState('Plan'); // 'Plan' or 'Schedule'
    const location = useLocation();

    const dietPlans = useMemo(() => ({
        Day: {
            title: 'Balanced Daily Plan',
            description: 'Single day plan — balanced macronutrients for training and recovery',
            meals: [
                { time: 'Breakfast', name: 'Oats + banana, almond milk, chia', calories: 420 },
                { time: 'Snack', name: 'Greek yogurt & berries', calories: 150 },
                { time: 'Lunch', name: 'Grilled chicken, quinoa, roasted veg', calories: 650 },
                { time: 'Snack', name: 'Apple + peanut butter', calories: 200 },
                { time: 'Dinner', name: 'Baked salmon, broccoli, sweet potato', calories: 700 },
            ],
        },

        Week: {
            title: '7-Day Performance Plan',
            description: 'A detailed day-by-day meal plan for a training week (breakfast, lunch, dinner + snacks).',
            days: [
                { day: 'Mon', meals: [{ time: 'Breakfast', name: 'Egg white omelette, spinach', calories: 420 }, { time: 'Snack', name: 'Protein bar', calories: 220 }, { time: 'Lunch', name: 'Turkey rice bowl with veg', calories: 650 }, { time: 'Snack', name: 'Orange', calories: 90 }, { time: 'Dinner', name: 'Steak, sweet potato, asparagus', calories: 800 }] },
                { day: 'Tue', meals: [{ time: 'Breakfast', name: 'Berry & oats smoothie (whey)', calories: 380 }, { time: 'Snack', name: 'Mixed nuts', calories: 200 }, { time: 'Lunch', name: 'Salmon salad with quinoa', calories: 640 }, { time: 'Snack', name: 'Cottage cheese', calories: 140 }, { time: 'Dinner', name: 'Chicken stir fry & brown rice', calories: 690 }] },
                { day: 'Wed', meals: [{ time: 'Breakfast', name: 'Greek yogurt, granola, fruit', calories: 390 }, { time: 'Snack', name: 'Banana', calories: 110 }, { time: 'Lunch', name: 'Beef & veg wraps', calories: 700 }, { time: 'Snack', name: 'Carrot sticks + hummus', calories: 120 }, { time: 'Dinner', name: 'Wholegrain pasta, lean mince', calories: 720 }] },
                { day: 'Thu', meals: [{ time: 'Breakfast', name: 'Porridge with nuts & honey', calories: 410 }, { time: 'Snack', name: 'Hard boiled eggs', calories: 140 }, { time: 'Lunch', name: 'Lentil curry & brown rice', calories: 650 }, { time: 'Snack', name: 'Apple', calories: 90 }, { time: 'Dinner', name: 'Grilled cod, veg medley', calories: 580 }] },
                { day: 'Fri', meals: [{ time: 'Breakfast', name: 'Protein pancakes with berries', calories: 450 }, { time: 'Snack', name: 'Yogurt', calories: 130 }, { time: 'Lunch', name: 'Chicken Caesar salad (light dressing)', calories: 620 }, { time: 'Snack', name: 'Rice cakes + avocado', calories: 160 }, { time: 'Dinner', name: 'Homemade thin-crust pizza (veg + lean meat)', calories: 780 }] },
                { day: 'Sat', meals: [{ time: 'Breakfast', name: 'Smoked salmon & bagel', calories: 470 }, { time: 'Snack', name: 'Smoothie', calories: 220 }, { time: 'Lunch', name: 'Brown rice, black beans & veg bowl', calories: 640 }, { time: 'Snack', name: 'Trail mix', calories: 200 }, { time: 'Dinner', name: 'BBQ chicken skewers, veg', calories: 700 }] },
                { day: 'Sun', meals: [{ time: 'Breakfast', name: 'Yogurt parfait + fruit', calories: 340 }, { time: 'Snack', name: 'Fruit salad', calories: 120 }, { time: 'Lunch', name: 'Roast chicken & seasonal veg', calories: 720 }, { time: 'Snack', name: 'Celery + peanut butter', calories: 130 }, { time: 'Dinner', name: 'Light vegetable soup & salad', calories: 420 }] },
            ],
        },

        Month: {
            title: 'Monthly Cycle — 4 Week Plan',
            description: 'A 4-week periodized nutrition plan that supports a training block (Build → Maintain → Recover). Click a week to view full daily meal suggestions.',
            weeks: [
                { week: 'Week 1', focus: 'Build', meals: 'Higher calories, focus on protein and complex carbs. Examples include: chicken rice bowls, hearty breakfasts and nutrient-dense dinners.' },
                { week: 'Week 2', focus: 'Build', meals: 'Sustain calorie surplus, emphasize carbs before hard workouts. Examples: pasta, oats, energy-dense snacks.' },
                { week: 'Week 3', focus: 'Maintain', meals: 'Balanced calories, steady macros. Mix of lean proteins, veg, moderate carbs.' },
                { week: 'Week 4', focus: 'Recover', meals: 'Lower calories, higher nutrient density for recovery. More vegetables, healthy fats, smaller portions.' },
            ],
        },
    }), []);

    const current = dietPlans[range];

    const [dietEntries, setDietEntries] = useState(() => JSON.parse(localStorage.getItem('dietEntries')) || []);
    const [workoutEntries, setWorkoutEntries] = useState(() => JSON.parse(localStorage.getItem('workoutEntries')) || []);
    const [scheduleEntries, setScheduleEntries] = useState(() => JSON.parse(localStorage.getItem('scheduleEntries')) || []);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ mealType: 'Breakfast', name: '', calories: '', time: '' });
    const [filter, setFilter] = useState('Today');
    const today = new Date().toISOString().slice(0, 10);
    const [date, setDate] = useState(today);

    useEffect(() => { localStorage.setItem('dietEntries', JSON.stringify(dietEntries)); }, [dietEntries]);
    useEffect(() => { localStorage.setItem('workoutEntries', JSON.stringify(workoutEntries)); }, [workoutEntries]);
    useEffect(() => { localStorage.setItem('scheduleEntries', JSON.stringify(scheduleEntries)); }, [scheduleEntries]);

    // react-router query handling: allow opening the page in schedule view via ?view=schedule&range=Week
    useEffect(() => {
        const q = new URLSearchParams(location.search);
        const v = q.get('view');
        if (v === 'schedule') setMode('Schedule');
        const r = q.get('range');
        if (r === 'Day' || r === 'Week' || r === 'Month') setRange(r);
    }, [location.search]);

    function addMeal() {
        if (!form.name || !form.calories) { alert('Provide meal name and calories'); return; }
        const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };
        const time = form.time ? new Date(form.time).toISOString() : new Date().toISOString();
        setDietEntries(s => [{ id: `m-${Date.now()}`, user: user.name, mealType: form.mealType, name: form.name, calories: Number(form.calories), time }, ...s]);
        setShowModal(false); setForm({ mealType: 'Breakfast', name: '', calories: '', time: '' });
    }

    function addWorkout() { const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' }; setWorkoutEntries(s => [{ id: `w-${Date.now()}`, user: user.name, type: 'start', time: new Date().toISOString() }, ...s]); }

    function combined() {
        const all = [...dietEntries.map(e => ({ ...e, kind: 'meal' })), ...workoutEntries.map(e => ({ ...e, kind: 'workout' }))];
        if (filter === 'All') return all.sort((a, b) => new Date(b.time) - new Date(a.time));
        if (filter === 'Today') return all.filter(x => (x.time || '').slice(0, 10) === today).sort((a, b) => new Date(b.time) - new Date(a.time));
        if (filter === 'Date') return all.filter(x => (x.time || '').slice(0, 10) === date).sort((a, b) => new Date(b.time) - new Date(a.time));
        return all;
    }

    function downloadCsv(rows) {
        const r = rows || combined(); const data = [['Type', 'User', 'Time', 'Details', 'Kcal']]; r.forEach(it => { if (it.type === 'start' || it.kind === 'workout') data.push(['workout', it.user, it.time, 'Started workout', '']); else data.push(['meal', it.user, it.time, `${it.mealType} - ${it.name}`, it.calories || '']); });
        const csv = data.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `fitrack-logs.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    }

    // helper to create a schedule table representation for the current range
    function renderScheduleTable() {
        if (range === 'Day') {
            // Single day schedule built from the 'Day' plan meals
            const meals = dietPlans.Day.meals;
            return (
                <table className="schedule-table">
                    <thead><tr><th>Time</th><th>Event</th><th>Kcal</th></tr></thead>
                    <tbody>
                        {meals.map((m, i) => (
                            <tr key={i}><td>{m.time}</td><td>{m.name}</td><td>{m.calories}</td></tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (range === 'Week') {
            // Create a grid where rows are meal types and columns are Mon..Sun
            const mealRows = ['Breakfast', 'Snack', 'Lunch', 'Snack', 'Dinner'];
            const days = dietPlans.Week.days; // Mon..Sun
            return (
                <div className="schedule-week-wrap">
                    <table className="schedule-table schedule-week">
                        <thead>
                            <tr>
                                <th>Meal</th>
                                {days.map((d) => <th key={d.day}>{d.day}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {mealRows.map((m) => (
                                <tr key={m}>
                                    <td className="meal-type">{m}</td>
                                    {days.map((d) => {
                                        const found = d.meals.find(x => x.time === m);
                                        return <td key={d.day}>{found ? `${found.name} (${found.calories} kcal)` : '-'}</td>;
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="schedule-note muted">Use this view as a weekly schedule reference for meals.</div>
                </div>
            );
        }

        if (range === 'Month') {
            // month table: weeks as columns with focus and short meals guidance
            const weeks = dietPlans.Month.weeks;
            return (
                <table className="schedule-table schedule-month">
                    <thead>
                        <tr><th>Week</th><th>Focus</th><th>Guidance</th></tr>
                    </thead>
                    <tbody>
                        {weeks.map((w, i) => (
                            <tr key={i}><td>{w.week}</td><td>{w.focus}</td><td>{w.meals || w.guidance || '-'}</td></tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        return null;
    }

    // Use jsPDF + html2canvas to convert HTML into a downloadable PDF (no print dialog)
    async function elementToPdf(el, filename = 'fitrack.pdf') {
        try {
            const canvas = await html2canvas(el, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(filename);
        } catch (err) {
            console.error('PDF export failed', err);
            alert('PDF export failed - please check console');
        }
    }

    async function downloadPdf(rows) {
        // Build an off-screen DOM element, render to canvas and save
        const r = rows || combined();
        const title = 'FitTrack logs';
        const wrapper = document.createElement('div');
        wrapper.style.padding = '18px';
        wrapper.style.fontFamily = 'Arial';
        wrapper.style.color = '#222';
        const tableHeader = `<thead><tr><th style="border:1px solid #ddd;padding:6px">Type</th><th style="border:1px solid #ddd;padding:6px">User</th><th style="border:1px solid #ddd;padding:6px">Time</th><th style="border:1px solid #ddd;padding:6px">Details</th><th style="border:1px solid #ddd;padding:6px">Kcal</th></tr></thead>`;
        const body = r.map(it => it.type === 'start' || it.kind === 'workout'
            ? `<tr><td style="border:1px solid #ddd;padding:6px">Workout</td><td style="border:1px solid #ddd;padding:6px">${it.user}</td><td style="border:1px solid #ddd;padding:6px">${new Date(it.time).toLocaleString()}</td><td style="border:1px solid #ddd;padding:6px">Started workout</td><td style="border:1px solid #ddd;padding:6px"></td></tr>`
            : `<tr><td style="border:1px solid #ddd;padding:6px">Meal</td><td style="border:1px solid #ddd;padding:6px">${it.user}</td><td style="border:1px solid #ddd;padding:6px">${new Date(it.time).toLocaleString()}</td><td style="border:1px solid #ddd;padding:6px">${it.mealType} - ${it.name}</td><td style="border:1px solid #ddd;padding:6px">${it.calories}</td></tr>`
        ).join('');

        wrapper.innerHTML = `<div style="max-width:780px;margin:0 auto"><h1>${title}</h1><table style="width:100%;border-collapse:collapse">${tableHeader}<tbody>${body}</tbody></table></div>`;
        document.body.appendChild(wrapper);
        await elementToPdf(wrapper, 'fitrack-logs.pdf');
        wrapper.remove();
    }

    // Download a printable plan for the selected range (Day / Week / Month)
    async function downloadPlan() {
        const p = dietPlans[range];
        const title = `${p.title} — ${range}`;
        let content = '';

        if (range === 'Day') {
            content += '<h2>Daily plan</h2><ul>' + p.meals.map(m => `<li><strong>${m.time}</strong>: ${m.name} — ${m.calories} kcal</li>`).join('') + '</ul>';
        } else if (range === 'Week') {
            content += '<h2>Weekly plan</h2>';
            p.days.forEach(d => {
                content += `<h3>${d.day}</h3><ul>` + d.meals.map(m => `<li><strong>${m.time}</strong>: ${m.name} — ${m.calories} kcal</li>`).join('') + '</ul>';
            });
        } else if (range === 'Month') {
            content += '<h2>Monthly plan (4-week cycle)</h2>';
            p.weeks.forEach(wk => { content += `<h3>${wk.week} — ${wk.focus}</h3><p>${wk.meals || wk.guidance || ''}</p>`; });
        }

        const style = 'body{font-family:Arial;color:#222;padding:18px}h1{font-size:20px}h2{font-size:18px}h3{font-size:16px}ul{padding-left:18px}';
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>${style}</style></head><body><h1>${title}</h1>${content}</body></html>`;
        // Create an off-screen element and export to PDF (direct download)
        const wrapper = document.createElement('div');
        wrapper.style.padding = '18px';
        wrapper.style.fontFamily = 'Arial';
        wrapper.style.color = '#222';
        wrapper.innerHTML = `<div style="max-width:780px;margin:0 auto"><h1>${title}</h1>${content}</div>`;
        document.body.appendChild(wrapper);
        await elementToPdf(wrapper, `${title.replace(/\s+/g, '-')}.pdf`);
        wrapper.remove();
    }

    return (
        <div className="fd-page">
            <header className="fd-hero"><div><h1>Food & Diet</h1><p className="muted">Detailed plans and date-wise logs — log meals here.</p></div><div className="fd-controls"><div className="mode-switch"><button className={mode === 'Plan' ? 'active' : ''} onClick={() => setMode('Plan')}>Plan</button><button className={mode === 'Schedule' ? 'active' : ''} onClick={() => setMode('Schedule')}>Schedule</button></div><div style={{ marginLeft: 8 }}><button className={range === 'Day' ? 'active' : ''} onClick={() => setRange('Day')}>Day</button><button className={range === 'Week' ? 'active' : ''} onClick={() => setRange('Week')}>Week</button><button className={range === 'Month' ? 'active' : ''} onClick={() => setRange('Month')}>Month</button></div></div></header>

            <main className="fd-content">
                <div className="fd-left">
                    <div className="fd-card overview"><h2>{current.title}</h2><p className="muted">{current.description}</p>
                        {mode === 'Schedule' && (
                            <div className="schedule-area">{renderScheduleTable()}</div>
                        )}
                        {mode === 'Plan' && (
                            <>
                                {range === 'Day' && (
                                    <div className="meals-list">{current.meals.map((m, i) => (<div className="meal-row" key={i}><div className="meal-time">{m.time}</div><div className="meal-name">{m.name}</div><div className="meal-kcal">{m.calories} kcal</div></div>))}</div>
                                )}
                                {range === 'Week' && (
                                    <div className="week-grid">{current.days.map((d, di) => (<div className="day-card" key={di}><div className="day-heading">{d.day}</div><div className="meals-list small">{d.meals.map((mm, mi) => (<div className="meal-row" key={mi}><div className="meal-time">{mm.time}</div><div className="meal-name">{mm.name}</div><div className="meal-kcal">{mm.calories} kcal</div></div>))}</div></div>))}</div>
                                )}
                                {range === 'Month' && (
                                    <div className="month-steps">{current.weeks.map((w, wi) => (<div className="phase-row" key={wi}><div className="phase-name">{w.week} — {w.focus}</div><div className="phase-guidance muted">{w.guidance}</div></div>))}</div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="fd-card logs">
                        <h3>Logs (meals & workout starts)</h3>
                        <div className="logs-toolbar"><select value={filter} onChange={e => setFilter(e.target.value)}><option>Today</option><option>All</option><option>Date</option></select>{filter === 'Date' && <input type="date" value={date} onChange={e => setDate(e.target.value)} />}<div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}><button className="btn outline" onClick={() => downloadPdf(combined())}>Download (PDF)</button><button className="btn outline" onClick={() => downloadCsv(combined())}>Download (CSV)</button></div></div>

                        <div className="logs-list">{combined().length === 0 ? <div className="muted">No logs</div> : combined().map(r => (<div className="log-row" key={r.id}><div className="log-left"><div className="log-user">{r.user}</div><div className="log-time muted">{new Date(r.time).toLocaleString()}</div></div><div className="log-right">{r.type === 'start' ? <span className="badge">Started workout</span> : <div>{r.mealType} — <strong>{r.name}</strong> <span className="muted">({r.calories} kcal)</span></div>}</div></div>))}</div>
                    </div>
                </div>

                <aside className="fd-right">
                    <div className="fd-card quick-tips"><h3>Quick Tips</h3><ul><li>Stay hydrated — 2-3L per day</li><li>Prioritise protein after resistance sessions</li><li>Match carbs with session intensity</li></ul></div>
                    <div className="fd-card actions"><h3>Actions</h3><button className="btn primary" onClick={() => setShowModal(true)}>Log a Meal</button><button className="btn outline" onClick={() => downloadPlan()}>Download Plan</button><button className="btn outline" onClick={() => downloadPdf()}>Download Logs (PDF)</button><button className="btn outline" onClick={() => downloadCsv()}>Download Logs (CSV)</button><div style={{ height: 8 }} /><button className="btn ghost" onClick={() => { addWorkout(); alert('Logged workout start') }}>Log Workout Start</button></div>
                </aside>
            </main>

            {showModal && (
                <div className="fd-modal"><div className="fd-modal-backdrop" onClick={() => setShowModal(false)} /><div className="fd-modal-panel"><h3>Log a Meal</h3><label className="modal-row"><div>Meal type</div><select value={form.mealType} onChange={e => setForm({ ...form, mealType: e.target.value })}><option>Breakfast</option><option>Snack</option><option>Lunch</option><option>Dinner</option></select></label><label className="modal-row"><div>Meal name</div><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label className="modal-row"><div>Calories</div><input type="number" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} /></label><label className="modal-row"><div>When</div><input type="datetime-local" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></label><div className="modal-actions"><button className="btn outline" onClick={() => setShowModal(false)}>Cancel</button><button className="btn primary" onClick={addMeal}>Save</button></div></div></div>
            )}
        </div>
    )
}
export default FoodDietPage;