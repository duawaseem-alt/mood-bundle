// import React from "react";
// import './login.css';
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// const Login=() => {
//     const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
   
   

//    if (email && password) {
//       localStorage.setItem("auth", "true");
//       navigate("/");
//     } else {
//       alert("Please fill in both fields.");
//     }
  
   
//     return (
//         <>
//         <div className="login-container">
//       <h2 className="login-heading">Login to MoodBundle</h2>
//       <input
//         className="login-input"
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         className="login-input"
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button className="login-button" onClick={handleLogin}>
//         Login
//       </button>
//       <p className="login-note">Using dummy auth — no backend</p>
//     </div>
  

//         </>
//     )
// }
// export default Login;
// src/components/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/authcontext.jsx";
import { useNavigate } from "react-router-dom";
import './login.css';

const Login = () => {
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
      <h2>Login</h2>
      {error && <p className="error-msg">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <input className="custom-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <input className="custom-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button className="login-btn" type="submit">Log In</button>
      </form>

      {/* <hr /> */}

      <button onClick={handleGoogleLogin} className="google-login-btn">
        Continue with Google
      </button>
      </div>
    </div>
  );
};

export default Login;
