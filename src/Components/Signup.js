import React, { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("ft_users") || "[]");
    const userExists = users.find((u) => u.email === formData.email);

    if (userExists) {
      setMessage({ text: "User already exists. Please login.", type: "error" });
      return;
    }

    users.push(formData);
    localStorage.setItem("ft_users", JSON.stringify(users));
    setMessage({ text: "Signup successful! Redirecting to login...", type: "success" });

    setTimeout(() => (window.location.href = "/login"), 1200);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>FitTrack Signup</h2>
        <p style={styles.subtitle}>
          Create your account and start tracking your fitness today!
        </p>

        {message.text && (
          <div
            style={{
              ...styles.message,
              background:
                message.type === "error"
                  ? "rgba(255, 60, 60, 0.15)"
                  : "rgba(0, 255, 120, 0.15)",
              color: message.type === "error" ? "#ff7b7b" : "#66ffa6",
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Signup
          </button>

          <p style={styles.footerText}>
            Already have an account?{" "}
            <a href="/login" style={styles.link}>
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

// 💅 Internal CSS Styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(180deg, #000, #111)",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#0f1113",
    padding: "35px 30px",
    borderRadius: "14px",
    boxShadow: "0 0 20px rgba(9, 149, 230, 1)",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    marginBottom: "6px",
    color: "#3cffe5ff",
  },
  subtitle: {
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "18px",
  },
  field: {
    marginBottom: "16px",
    textAlign: "left",
  },
  label: {
    display: "block",
    color: "#bbb",
    marginBottom: "5px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    background: "#1a1d21",
    color: "#fff",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    background: "linear-gradient(90deg, #199aceff, #16d39aff)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "6px",
    transition: "0.3s ease",
  },
  message: {
    marginBottom: "14px",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  footerText: {
    marginTop: "14px",
    color: "#aaa",
    fontSize: "14px",
  },
  link: {
    color: "#ff4a4a",
    textDecoration: "none",
    fontWeight: "500",
  },
};
