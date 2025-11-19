// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css"; // Optional: External CSS for styles

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     // Add actual login logic here (e.g., API call)
//     console.log("Logging in:", email, password);

//     alert("Login successful!");
//     navigate("/"); // Redirect to dashboard or home
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleLogin} className="login-form">
//         <h2>Login</h2>

//         {error && <p className="error">{error}</p>}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit">Login</button>

//         <p className="redirect-text">
//           Don't have an account?{" "}
//           <span onClick={() => navigate("/signup")}>Sign up here</span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;
 
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     console.log("Logging in:", email, password);

//     alert("Login successful!");
//     navigate("/"); 
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleLogin} className="login-form">
//         <h2 className="title">Login</h2>

//         {error && <p className="error">{error}</p>}

//         <input
//           type="email"
//           placeholder="Email"
//           className="input-box"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="input-box"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit" className="login-btn">
//           Login
//         </button>

//         <p className="redirect-text">
//           Don't have an account?{" "}
//           <span className="signup-link" onClick={() => navigate("/signup")}>
//             Sign up here
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // --- Here you'd normally call your auth API ---
    // For demo: store a fake profile (replace with real data later)
    const user = {
      name: "Pavan Kalyan",
      email,
      avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
        email
      )}`,
      // you can add more fields: age, gender, stats etc.
    };

    localStorage.setItem("user", JSON.stringify(user));
    setError("");
    // Optional: store a token flag to indicate logged-in state
    localStorage.setItem("isLoggedIn", "true");

    // navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="title">Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="redirect-text">
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign up here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
