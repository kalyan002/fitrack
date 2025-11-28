import React from 'react';
import './Footer.css';

export default function Footer() {
    return (
        <footer id="site-footer" className="site-footer">
            <div className="footer-inner">
                <div className="footer-left">
                    <div className="footer-brand">FitTrack</div>
                    <p className="footer-desc">Personal training, smart tracking and nutrition guidance — all in one place.</p>
                    <div className="footer-socials">
                        <button>FB</button>
                        <button>IG</button>
                        <button>TW</button>
                    </div>
                </div>

                <div className="footer-links">
                    <h4>Quick links</h4>
                    <ul>
                        <li>Dashboard</li>
                        <li>Workouts</li>
                        <li>Nutrition</li>
                        <li>Schedule</li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>Contact</h4>
                    <p>support@fittrack.example</p>
                    <p>+1 (555) 123-4567</p>
                </div>
            </div>

            <div className="footer-bar">© 2025 FitTrack </div>
        </footer>
    )
}
