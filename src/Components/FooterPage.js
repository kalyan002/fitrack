import React from "react";
import { useNavigate } from "react-router-dom";
import "./FooterPage.css";

export default function FooterPage() {
    const navigate = useNavigate();

    return (
        <div className="footerpage-root">
            <header className="fp-header">
                <div className="fp-brand" onClick={() => navigate('/')}>FitTrack</div>
                <nav className="fp-nav">
                    <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                    <button onClick={() => navigate('/profile')}>Profile</button>
                </nav>
            </header>

            <main className="fp-main">
                <section className="fp-intro">
                    
                    <h1>Contact & Locations</h1>
                    <p>
                        Welcome to FitTrack's contact and location page. Find our center on the
                        map below — use the map to get directions or inspect the surrounding area.
                    </p>
                </section>

                <section className="fp-content">
                    <div className="fp-contact card">
                        <h3>Head Office</h3>
                        <p>FitTrack Inc.<br />123 Fitness Ave<br />Your City, YC 12345</p>
                        <p>Email: support@fittrack.example</p>
                        <p>Phone: +1 (555) 123-4567</p>
                    </div>

                    <div className="fp-map card">
                        <h3>Map</h3>
                        {/* Google Maps iframe embed - replace the src with your location if needed */}
                        <div className="fp-map-embed">
                            <iframe
                                title="FitTrack location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019707850508!2d-122.41941568468123!3d37.77492927975978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f12a1a37%3A0xa0f8f5a5f7b7f6c3!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1701024000000!5m2!1sen!2sus"
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="fp-footer">
                <small>© 2025 FitTrack. — Built with ❤️</small>
            </footer>
        </div>
    );
}
