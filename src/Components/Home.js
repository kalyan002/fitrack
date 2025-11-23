import React, { useEffect } from "react";
import "./Home.css";
import {
  FaDumbbell,
  FaHeartbeat,
  FaAppleAlt,
  FaStar,
  FaUserTie,
  FaTrophy,
  FaBullseye,
  FaMedal,
  FaCrown,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const navigate = useNavigate();

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  // Sample Data
  const weightData = [
    { month: "Jan", weight: 80 },
    { month: "Feb", weight: 79 },
    { month: "Mar", weight: 78 },
    { month: "Apr", weight: 77 },
    { month: "May", weight: 76 },
    { month: "Jun", weight: 75 },
  ];

  const strengthData = [
    { week: "W1", bench: 40 },
    { week: "W2", bench: 42 },
    { week: "W3", bench: 45 },
    { week: "W4", bench: 47 },
    { week: "W5", bench: 49 },
    { week: "W6", bench: 52 },
  ];

  return (
    <div className="landing-container">
      {/* NAVBAR */}
      <header className="navbar">
        <div
          className="logo"
          onClick={() => handleScroll("hero")}
          style={{ cursor: "pointer" }}
        >
          FitTrack
        </div>
        <nav>
          <button onClick={() => handleScroll("features")}>Features</button>
          <button onClick={() => handleScroll("trainers")}>Trainers</button>
          <button onClick={() => handleScroll("progress")}>Progress</button>
          <button onClick={() => handleScroll("goals")}>Goals</button>
          <button onClick={() => handleScroll("reviews")}>Reviews</button>
          <button onClick={() => handleScroll("feedback")}>Feedback</button>
        </nav>
        <div className="nav-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="signup-btn" onClick={() => navigate("/signup")}>
            Signup
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 data-aos="fade-up">Train Smarter. Live Healthier.</h1>
          <p data-aos="fade-up" data-aos-delay="200">
            FitTrack connects you with professional trainers, personalized
            workout plans, nutrition tracking, and progress analytics — all in one
            platform.
          </p>
          <div className="hero-buttons">
            {/* Start button now redirects to login */}
            <button
              className="hero-btn"
              data-aos="fade-up"
              data-aos-delay="400"
              onClick={() => navigate("/login")}
              aria-label="Start - go to login"
            >
              Start
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features">
        <h2 data-aos="fade-right">Main Features</h2>
        <div className="feature-grid">
          <div className="feature-card" data-aos="zoom-in">
            <FaBullseye className="feature-icon" />
            <h3>Goal Setting</h3>
            <p>Set your fitness targets and track your progress every week.</p>
          </div>
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="200">
            <FaTrophy className="feature-icon" />
            <h3>Badges & Achievements</h3>
            <p>Earn rewards as you hit new personal bests and milestones.</p>
          </div>
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="400">
            <FaHeartbeat className="feature-icon" />
            <h3>Health Monitoring</h3>
            <p>Track your heart rate, BMI, and overall health statistics.</p>
          </div>
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="600">
            <FaAppleAlt className="feature-icon" />
            <h3>Nutrition & Water Tracking</h3>
            <p>Monitor calories, water intake, and daily nutrients easily.</p>
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

      {/* PROGRESS SECTION */}
      <section id="progress" className="progress-section">
        <h2>Your Progress</h2>
        <div className="progress-container">
          <div className="progress-chart" data-aos="zoom-in">
            <h3>Weight Progress (kg)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#ff4d4d"
                  strokeWidth={2}
                  dot={{ fill: "#ff4d4d" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="progress-chart" data-aos="zoom-in" data-aos-delay="200">
            <h3>Bench Press Progress (kg)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={strengthData}>
                <defs>
                  <linearGradient id="colorBench" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="week" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="bench"
                  stroke="#00ff88"
                  fillOpacity={1}
                  fill="url(#colorBench)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* GOALS & ACHIEVEMENTS SECTION */}
      <section id="goals" className="goals-section">
        <h2 data-aos="fade-up">Goals & Achievements</h2>
        <div className="goals-grid">
          <div className="goal-card" data-aos="zoom-in">
            <FaBullseye className="goal-icon" />
            <h3>Goal: Lose 5kg</h3>
            <p>Progress: 80% completed</p>
            <div className="goal-bar">
              <div className="goal-progress" style={{ width: "80%" }}></div>
            </div>
          </div>

          <div className="goal-card" data-aos="zoom-in" data-aos-delay="200">
            <FaDumbbell className="goal-icon" />
            <h3>Goal: Bench 60kg</h3>
            <p>Progress: 70% completed</p>
            <div className="goal-bar">
              <div className="goal-progress" style={{ width: "70%" }}></div>
            </div>
          </div>

          <div className="goal-card" data-aos="zoom-in" data-aos-delay="400">
            <FaHeartbeat className="goal-icon" />
            <h3>Goal: Improve Endurance</h3>
            <p>Progress: 50% completed</p>
            <div className="goal-bar">
              <div className="goal-progress" style={{ width: "50%" }}></div>
            </div>
          </div>
        </div>

        <div className="achievements">
          <h3 data-aos="fade-up">Achievements Unlocked</h3>
          <div className="achievement-grid">
            <div className="achievement-card" data-aos="flip-left">
              <FaMedal className="achievement-icon gold" />
              <p>First Workout Logged</p>
            </div>
            <div className="achievement-card" data-aos="flip-left" data-aos-delay="200">
              <FaTrophy className="achievement-icon silver" />
              <p>10-Day Consistency Streak</p>
            </div>
            <div className="achievement-card" data-aos="flip-left" data-aos-delay="400">
              <FaCrown className="achievement-icon bronze" />
              <p>Reached Fitness Level 5</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="reviews">
        <h2 data-aos="fade-right">What Our Users Say</h2>
        <div className="review-grid">
          <div className="review-card" data-aos="fade-up">
            <FaStar className="star" />
            <FaStar className="star" />
            <FaStar className="star" />
            <FaStar className="star" />
            <FaStar className="star" />
            <p>
              “FitTrack completely transformed how I train. I can monitor my
              workouts and nutrition in one place!”
            </p>
            <h4>- Sarah M.</h4>
          </div>

          <div className="review-card" data-aos="fade-up" data-aos-delay="200">
            <FaStar className="star" />
            <FaStar className="star" />
            <FaStar className="star" />
            <FaStar className="star" />
            <FaStar className="star" />
            <p>
              “The trainer guidance is top-notch! I’ve hit personal bests I never thought possible.”
            </p>
            <h4>- Michael K.</h4>
          </div>

          <div className="review-card" data-aos="fade-up" data-aos-delay="400">
            <FaStar className="star" />
            <FaStar className="star" />
            <FaStar className="star" />
            <FaStar className="star" />
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
