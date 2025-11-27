import React, { useMemo, useState } from "react";
import "./TotalSessions.css";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaArrowLeft, FaHome } from "react-icons/fa";


// Presentational component for a gym-style 'Total Sessions' page
export default function TotalSessions({ count = 32, goal = 50 }) {
  // UI state
  const [range, setRange] = useState("Week");
  const [sessionsCount, setSessionsCount] = useState(count);
  const [showBookModal, setShowBookModal] = useState(false);

  // Mock datasets for each range — in a real app these would come from an API/store
  const dataByRange = useMemo(() => ({
    Week: {
      count: sessionsCount || count,
      goal: goal,
      stats: [
        { id: 1, label: "Completed", value: sessionsCount || count },
        { id: 2, label: "Hours Trained", value: "8h" },
        { id: 3, label: "Avg uration", value: "40m" },
        { id: 4, label: "Calories", value: "2.3k" },
      ],
      recent: [
        { id: 1, title: "Upper Body Strength", date: "Nov 20", duration: "50m", kcal: 420 },
        { id: 2, title: "HIIT Blast", date: "Nov 18", duration: "30m", kcal: 350 },
        { id: 3, title: "Yoga Cooldown", date: "Nov 16", duration: "40m", kcal: 180 },
      ],
    },
    Month: {
      count: sessionsCount + 8,
      goal: goal,
      stats: [
        { id: 1, label: "Completed", value: sessionsCount + 8 },
        { id: 2, label: "Hours Trained", value: "32h" },
        { id: 3, label: "Avg Duration", value: "42m" },
        { id: 4, label: "Calories", value: "9.8k" },
      ],
      recent: [
        { id: 4, title: "Leg Day", date: "Nov 12", duration: "60m", kcal: 600 },
        { id: 5, title: "Core Power", date: "Nov 10", duration: "45m", kcal: 280 },
        { id: 6, title: "Spin Class", date: "Nov 08", duration: "50m", kcal: 480 },
      ],
    },
    Year: {
      count: sessionsCount + 38,
      goal: goal,
      stats: [
        { id: 1, label: "Completed", value: sessionsCount + 38 },
        { id: 2, label: "Hours Trained", value: "340h" },
        { id: 3, label: "Avg Duration", value: "46m" },
        { id: 4, label: "Calories", value: "125.3k" },
      ],
      recent: [
        { id: 7, title: "Seasonal Marathon Training", date: "Oct 05", duration: "120m", kcal: 1100 },
        { id: 8, title: "Strength Cycle", date: "Aug 20", duration: "75m", kcal: 720 },
        { id: 9, title: "Recovery Week", date: "Jul 30", duration: "40m", kcal: 220 },
      ],
    },
  }), [sessionsCount, count, goal]);

  const current = dataByRange[range];
  const percent = Math.round((Number(current.count) / Number(current.goal)) * 100);

  // ---- helpers ----
  async function elementToPdf(el, filename = 'sessions-report.pdf') {
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
      alert('PDF export failed - check console for details');
    }
  }

  async function downloadReport(data) {
    // Build CSV content from 'data.recent' and 'data.stats'
    const lines = [];
    lines.push(['Type', 'Title', 'Date', 'Duration', 'Kcal'].join(','));
    data.recent.forEach((row) => {
      lines.push(['recent', escapeCsv(row.title), row.date, row.duration, row.kcal ?? ''].join(','));
    });

    // Add a section for stats
    lines.push('');
    lines.push(['Stat', 'Value'].join(','));
    data.stats.forEach((s) => lines.push([escapeCsv(s.label), escapeCsv(String(s.value))].join(',')));

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessions-${range.toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function escapeCsv(value) {
    if (value == null) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

 return (
  <div className="ts-page">

   {/* === NAVBAR === */}
<nav className="ts-navbar">
  <button className="nav-btn" onClick={() => window.history.back()}>
    <FaArrowLeft /> Back
  </button>

  <div className="nav-title">Total Sessions</div>

  <button className="nav-btn" onClick={() => window.location.href = '/dashboard'}>
    <FaHome /> Dashboard
  </button>
</nav>
{/* === END NAVBAR === */}


      <main className="ts-content">
        <section className="ts-left">
          <div className="ts-card progress-card">
            <div className="progress-left">
              <div className="progress-ring" style={{ "--percent": `${Math.min(percent, 100)}%` }}>
                <svg viewBox="0 0 36 36" className="circular-chart orange">
                  <path className="circle-bg"
                    d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle"
                    strokeDasharray={`${Math.min(percent, 100)}, 100`}
                    d="M18 2.0845
                           a 15.9155 15.9155 0 0 1 0 31.831
                           a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>

                <div className="progress-inner">
                  <div className="big-number">{current.count}</div>
                  <div className="small-text">of {current.goal} sessions</div>
                </div>
              </div>

              <div className="progress-actions">
                <button className="btn primary" onClick={() => setShowBookModal(true)}>Book Session</button>
                <button className="btn outline" onClick={() => downloadPdf(current)}>Download Report</button>
              </div>
            </div>

            <div className="progress-right stats-grid">
              {current.stats.map((s) => (
                <div className="stat" key={s.id}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ts-card training-note">
            <h3>Motivation tip</h3>
            <p>Keep sessions short and consistent — sprinkle high-intensity intervals and dedicated mobility work weekly.</p>
          </div>
        </section>

        <aside className="ts-right">
          <div className="ts-card recent-sessions">
            <h3>Recent Sessions</h3>

            <ul>
              {current.recent.map((r) => (
                <li key={r.id} className="recent-row">
                  <div className="thumb">🏋️‍♂️</div>
                  <div className="meta">
                    <div className="title">{r.title}</div>
                    <div className="sub">{r.date} • {r.duration}</div>
                  </div>
                  <div className="badge">+{r.kcal ?? Math.floor(Math.random() * 400) + 100} kcal</div>
                </li>
              ))}
            </ul>

            <div className="view-all">See detailed history →</div>
          </div>

          <div className="ts-card goal-card">
            <h4>Goal Progress</h4>
            <div className="goal-line">
              <div className="goal-bar" style={{ width: `${Math.min(percent, 100)}%` }} />
            </div>
            <div className="goal-meta">{percent}% of seasonal target</div>
          </div>
        </aside>
      </main>

      {/* Booking modal — simple in-component modal */}
      {showBookModal && (
        <div className="ts-modal">
          <div className="ts-modal-backdrop" onClick={() => setShowBookModal(false)} />
          <div className="ts-modal-panel">
            <h3>Book a Workout Session</h3>
            <p>Choose a session type and schedule. This demo will add one session to the counter.</p>

            <div className="modal-actions">
              <button className="btn outline" onClick={() => setShowBookModal(false)}>Cancel</button>
              <button className="btn primary" onClick={() => { setSessionsCount((c) => c + 1); setShowBookModal(false); }}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ---- helpers ----
  // Create a PDF report and download directly (no print dialog)
  async function downloadPdf(data) {
    const title = `Sessions Report - ${range}`;

    const style = `
      body { font-family: Arial, Helvetica, sans-serif; color: #222; margin: 20px; }
      h1 { font-size: 20px; margin-bottom: 6px; }
      .muted { color: #666; font-size: 13px; margin-bottom: 18px; }
      .section { margin-bottom: 14px; }
      .stats { display:flex; gap:12px; flex-wrap:wrap; }
      .stat { background:#f5f7fb; padding:10px 12px; border-radius:6px; min-width:140px; }
      table { width:100%; border-collapse:collapse; margin-top:8px; }
      th,td { border:1px solid #e6e9ef; padding:6px 10px; text-align:left; font-size:13px; }
    `;

    const statsHtml = data.stats.map(s => `<div class="stat"><div style="font-weight:700">${escapeHtml(String(s.value))}</div><div style="color:#555; font-size:12px">${escapeHtml(s.label)}</div></div>`).join('');

    const recentRows = data.recent.map(r => `<tr><td>${escapeHtml(r.title)}</td><td>${escapeHtml(r.date)}</td><td>${escapeHtml(r.duration)}</td><td>${escapeHtml(String(r.kcal ?? ''))}</td></tr>`).join('');

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(title)}</title>
          <style>${style}</style>
        </head>
        <body>
          <h1>${escapeHtml(title)}</h1>
          <div class="muted">Generated: ${new Date().toLocaleString()}</div>

          <div class="section">
            <strong>Progress</strong>
            <div style="margin-top:8px">${escapeHtml(String(data.count))} of ${escapeHtml(String(data.goal))} sessions (${Math.round((Number(data.count) / Number(data.goal)) * 100)}%)</div>
          </div>

          <div class="section stats">${statsHtml}</div>

          <div class="section">
            <strong>Recent Sessions</strong>
            <table>
              <thead><tr><th>Title</th><th>Date</th><th>Duration</th><th>Kcal</th></tr></thead>
              <tbody>${recentRows}</tbody>
            </table>
          </div>

          <div style="margin-top:28px; color:#444; font-size:12px">Generated with fitrack — keep training 💪</div>
        </body>
      </html>
    `;

    // Render off-screen element and save as PDF directly
    const wrapper = document.createElement('div');
    wrapper.style.padding = '20px';
    wrapper.style.fontFamily = 'Arial, Helvetica, sans-serif';
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    await elementToPdf(wrapper, `sessions-${range.toLowerCase()}.pdf`);
    wrapper.remove();
  }

  function escapeCsv(value) {
    if (value == null) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
