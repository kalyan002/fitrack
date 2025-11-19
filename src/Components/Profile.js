import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("user")) || {};
  const [name, setName] = useState(stored.name || "");
  const [email, setEmail] = useState(stored.email || "");
  const [avatar, setAvatar] = useState(stored.avatar || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Keep form synced with storage same-session (optional)
    const onStorage = () => {
      const u = JSON.parse(localStorage.getItem("user")) || {};
      setName(u.name || "");
      setEmail(u.email || "");
      setAvatar(u.avatar || "");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !email) {
      setMessage("Name and email are required.");
      return;
    }

    const user = { ...stored, name, email, avatar };
    localStorage.setItem("user", JSON.stringify(user));
    setMessage("Profile saved!");
    // return to dashboard after a small delay so user sees message
    setTimeout(() => navigate("/dashboard"), 600);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Profile</h2>
        <div className="profile-top">
          <img src={avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(email || name || "guest")}`} alt="avatar" className="profile-preview" />
          <div className="profile-meta">
            <h3>{name || "Guest"}</h3>
            <p className="muted">{email || "No email set"}</p>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSave}>
          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label>
            Avatar URL (optional)
            <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
          </label>

          <div className="profile-actions">
            <button type="submit" className="btn-save">Save Profile</button>
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          </div>

          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
