import React, { useEffect } from "react";
import "./Home.css";
import {
  FaDumbbell,
  FaChartLine,
  FaHeartbeat,
  FaAppleAlt,
  FaStar,
  FaUserTie,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-container">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">FitTrack</div>

        <nav>
          <button onClick={() => handleScroll("features")}>Features</button>
          <button onClick={() => handleScroll("trainers")}>Trainers</button>
          <button onClick={() => handleScroll("reviews")}>Reviews</button>
          <button onClick={() => handleScroll("feedback")}>Feedback</button>
        </nav>

        <div className="nav-buttons">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Signup</button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 data-aos="fade-up">Train Smarter. Live Healthier.</h1>
          <p data-aos="fade-up" data-aos-delay="200">
            FitTrack connects you with professional trainers, personalized
            workout plans, and progress tracking — all in one powerful fitness
            platform.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn" data-aos="fade-up" data-aos-delay="400">
              Start Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features">
        <h2 data-aos="fade-right">Main Features</h2>
        <div className="feature-grid">
          <div className="feature-card" data-aos="zoom-in">
            <FaDumbbell className="feature-icon" />
            <h3>Workout Tracking</h3>
            <p>Log exercises, customize routines, and track progress.</p>
          </div>
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="200">
            <FaChartLine className="feature-icon" />
            <h3>Progress Analytics</h3>
            <p>Visualize your strength, endurance, and weight trends.</p>
          </div>
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="400">
            <FaHeartbeat className="feature-icon" />
            <h3>Health Monitoring</h3>
            <p>Track heart rate, BMI, and vital metrics in one dashboard.</p>
          </div>
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="600">
            <FaAppleAlt className="feature-icon" />
            <h3>Nutrition Tracking</h3>
            <p>Monitor calories, macronutrients, and meal plans.</p>
          </div>
        </div>
      </section>

      {/* TRAINERS SECTION */}
      <section id="trainers" className="trainers">
        <h2 data-aos="fade-up">Meet Our Professional Trainers</h2>
        <div className="trainer-grid">
          <div className="trainer-card" data-aos="flip-up">
            <FaUserTie className="trainer-icon" />
            <h3>John Carter</h3>
            <p>Certified Strength & Conditioning Coach</p>
          </div>
          <div className="trainer-card" data-aos="flip-up" data-aos-delay="200">
            <FaUserTie className="trainer-icon" />
            <h3>Emily Stone</h3>
            <p>Yoga & Flexibility Specialist</p>
          </div>
          <div className="trainer-card" data-aos="flip-up" data-aos-delay="400">
            <FaUserTie className="trainer-icon" />
            <h3>Alex Johnson</h3>
            <p>Nutrition & Weight Management Expert</p>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="reviews">
        <h2 data-aos="fade-right">What Our Users Say</h2>
        <div className="review-grid">
          <div className="review-card" data-aos="fade-up">
            <FaStar className="star" /> <FaStar className="star" />
            <FaStar className="star" /> <FaStar className="star" />
            <FaStar className="star" />
            <p>
              “FitTrack completely transformed how I train. I can monitor my
              workouts and nutrition in one place!”
            </p>
            <h4>- Sarah M.</h4>
          </div>

          <div className="review-card" data-aos="fade-up" data-aos-delay="200">
            <FaStar className="star" /> <FaStar className="star" />
            <FaStar className="star" /> <FaStar className="star" />
            <FaStar className="star" />
            <p>
              “The trainer guidance is top-notch! I’ve hit personal bests I never thought possible.”
            </p>
            <h4>- Michael K.</h4>
          </div>

          <div className="review-card" data-aos="fade-up" data-aos-delay="400">
            <FaStar className="star" /> <FaStar className="star" />
            <FaStar className="star" /> <FaStar className="star" />
            <FaStar className="star-half" />
            <p>
              “The app is clean, fast, and makes fitness tracking effortless. Highly recommend!”
            </p>
            <h4>- Priya R.</h4>
          </div>
        </div>
      </section>

      {/* FEEDBACK SECTION */}
      <section id="feedback" className="feedback">
        <h2 data-aos="fade-up">We Value Your Feedback</h2>
        <form className="feedback-form" data-aos="zoom-in">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Write your feedback..." required></textarea>
          <button type="submit">Submit Feedback</button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="footer">© 2025 FitTrack. All rights reserved.</footer>
    </div>
  );
}

export default Home;
